import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, HStack, IconButton, Image, Text, Toast, VStack, useTheme } from 'native-base';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { LocalVideo } from './components/LocalVideo';
import { MicIcon, MicOffIcon, PhoneIcon, VideoIcon } from 'components/Icons/Light';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
} from 'react-native-webrtc';
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import { useIsFocused } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from 'hooks/index';
import sendCallMessage from 'utils/sendCallMessage';
import { CallState, callActions } from 'slice/call';
import { SwitchCameraIcon } from 'components/Icons/Light/SwitchCamera';
import { VolumeIcon } from 'components/Icons/Light/Volume';
import { VideoOffIcon } from 'components/Icons/Light/VideoOff';
import { BackHandler } from 'react-native';
import { Alert, StyleSheet } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import LoudSpeaker from 'react-native-toggle-loud-speaker';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

export const CallingScreen = (props: RootStackScreenProps<RootNavigatekey.Calling> | any) => {
    const { colors } = useTheme();
    const [isOnMic, setIsOnMic] = useState(props?.route.params?.isOnMic ?? true);
    const [isOnSpeaker, setIsOnSpeaker] = useState(props?.route.params?.isOnSpeaker ?? false);
    const [isOnVideo, setIsOnVideo] = useState(props?.route.params?.isOnVideo ?? true);
    const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(true);
    const callState = useAppSelector((state) => state.call);
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    console.log('On Mic', isOnMic);

    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(props?.route.params?.remoteStream || null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(props?.route.params?.localStream || null);
    const pc = useRef<RTCPeerConnection | null>(props?.route.params?.pc || null);
    const remoteUser = useMemo(() => {
        // this is from user
        if (callState.infor?.fromUser.id === user?.id) {
            return callState.infor?.toUser;
        }
        // this is to user
        if (callState.infor?.toUser.id === user?.id) {
            return callState.infor?.fromUser;
        }
    }, [callState.infor]);

    // Listen to offvideo
    useEffect(() => {
        if (!callState.infor) {
            return;
        }

        const unsubscribe = onSnapshot(doc(db, 'calls', callState.infor?.id), (doc) => {
            // this is from user
            if (callState.infor?.fromUser.id === user?.id) {
                doc.data()?.toUser?.isOnVideo ?? setIsRemoteVideoOn(doc.data()?.toUser?.isOnVideo);
                // console.log('📹:', doc.data()?.toUser?.isOnVideo)
            }
            // this is to user
            if (callState.infor?.toUser.id === user?.id) {
                doc.data()?.toUser?.isOnVideo ?? setIsRemoteVideoOn(doc.data()?.fromUser?.isOnVideo);
            }
        });

        return () => unsubscribe();
    }, [callState.infor]);


    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.primary[900],
            headerBackVisible: false,
            headerRight: () =>
                callState?.infor?.type !== 'no-video' && (
                    <HStack>
                        <IconButton
                            rounded="full"
                            onPress={handleToggleVideo}
                            icon={
                                isOnVideo ? (
                                    <VideoIcon size="xl" color={colors.primary[900]} />
                                ) : (
                                    <VideoOffIcon size="xl" color={colors.primary[900]} />
                                )
                            }
                        />
                        <IconButton
                            rounded="full"
                            onPress={handleSwitchCamera}
                            icon={<SwitchCameraIcon size="xl" color={colors.primary[900]} />}
                        />
                    </HStack>
                ),
        });
    }, [props.navigation, isOnVideo, localStream]);

    useEffect(() => {
        // if (!isFocused) return;
        initCall();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                'Hang up',
                'Do you want to hang up now!',
                [
                    { text: 'Keep call', style: 'cancel', onPress: () => { } },
                    {
                        text: 'Hang up',
                        style: 'destructive',
                        onPress: () => handleEndCall(),
                    },
                ],
                { cancelable: true },
            );
            return true;
        });
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (callState.state === CallState.NoCall) {
            handleEndCall();
        }
    }, [callState]);

    async function initCall() {
        try {
            if (!pc.current) {
                await setUpWebcamAndMediaStream();
                await joinCall(callState.infor?.id);
            }
        } catch (err) {
            props.navigation.goBack();
        }
    }

    useEffect(() => {
        // Check connection state
        const eventHandler = (event: any) => {
            console.log('🔌 Peer Connection State: ' + pc.current?.connectionState);
            if (pc.current?.connectionState === 'disconnected' || pc.current?.connectionState === 'failed') {
                handleEndCall();
            }
        };
        pc.current?.addEventListener('connectionstatechange', eventHandler);

        return () => {
            pc.current?.removeEventListener('connectionstatechange', eventHandler);
        };
    }, [localStream, remoteStream]);

    function handleToggleVideo() {
        // if (isOnVideo) {
        //     // handle off video
        //     localStream!.getVideoTracks()[0].enabled = false;
        // } else {
        //     // handle on video
        //     localStream!.getVideoTracks()[0].enabled = true;
        // }
        const isOnVideoAfterChange = !isOnVideo;
        // this is from user
        if (callState.infor?.fromUser.id === user?.id) {
            console.log('setting video', isOnVideoAfterChange);
            updateDoc(doc(db, 'calls', callState.infor?.id), {
                'fromUser.isOnVideo': isOnVideoAfterChange,
            });
        }
        // this is from user
        if (callState.infor?.toUser.id === user?.id) {
            updateDoc(doc(db, 'calls', callState.infor?.id), {
                'toUser.isOnVideo': isOnVideoAfterChange,
            });
        }
        setIsOnVideo(isOnVideoAfterChange);
    }
    function handleToggleMic() {
        if (isOnMic) {
            // handle off video
            localStream!.getAudioTracks()[0].enabled = false;
        } else {
            // handle on video
            localStream!.getAudioTracks()[0].enabled = true;
        }
        setIsOnMic(!isOnMic);
    }
    function handleToggleSpeaker() {
        setIsOnSpeaker((cur) => {
            LoudSpeaker.open(!cur);
            return !cur;
        });
    }
    function handleSwitchCamera() {
        localStream?.getVideoTracks()[0]._switchCamera();
    }

    async function setUpWebcamAndMediaStream() {
        pc.current = new RTCPeerConnection(servers);
        const local = await mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        pc.current?.addStream(local);
        setLocalStream(local);
        let remote = new MediaStream(undefined);
        setRemoteStream(remote);

        // Check connection state
        pc.current?.addEventListener('connectionstatechange', (event) => {
            console.log('🔌 Peer Connection State: ' + pc.current?.connectionState);
            if (pc.current?.connectionState === 'disconnected' || pc.current?.connectionState === 'failed') {
                handleEndCall();
            }
        });

        // Push tracks from local stream to peer connection
        local.getTracks().forEach((track: MediaStreamTrack) => {
            pc.current?.getLocalStreams()[0].addTrack(track);
        });

        // Pull tracks from remote stream, add to video stream
        pc.current.ontrack = (event: any) => {
            event.streams[0].getTracks().forEach((track: any) => {
                remote.addTrack(track);
            });
        };
        pc.current.onaddstream = (event: any) => {
            setRemoteStream(event.stream);
        };
    }

    async function joinCall(docId: any) {
        const callDoc = doc(db, 'calls', docId);
        const offerCandidates = collection(db, 'calls', docId, 'offerCandidates');
        const answerCandidates = collection(db, 'calls', docId, 'answerCandidates');

        pc.current!.onicecandidate = async (event: any) => {
            if (event.candidate) {
                await addDoc(answerCandidates, event.candidate.toJSON());
            }
        };

        const callDocument = await getDoc(callDoc);
        const callData = callDocument.data();

        const offerDescription = callData?.offer;

        await pc.current!.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = (await pc.current?.createAnswer()) as RTCSessionDescription;
        await pc.current?.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await updateDoc(callDoc, { answer });
        onSnapshot(offerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    pc.current?.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    }

    async function handleHangup() {
        // Send mesage to other divice to hangup
        let deviceToken;
        // this is from user
        if (callState.infor?.fromUser.id === user?.id) {
            deviceToken = callState.infor?.toUser.deviceToken;
        }
        // this is to user
        if (callState.infor?.toUser.id === user?.id) {
            deviceToken = callState.infor?.fromUser.deviceToken;
        }
        try {
            deviceToken &&
                sendCallMessage(deviceToken, {
                    type: 'hangup',
                    docId: callState.infor?.id,
                });
        } finally {
            handleEndCall();
        }
    }

    function handleEndCall() {
        localStream?.getTracks().forEach((track) => {
            track.stop();
        });
        remoteStream?.getTracks().forEach((track) => {
            track.stop();
        });
        pc.current?.close();
        dispatch(callActions.changeCallState(CallState.NoCall));
        dispatch(callActions.changeCallInfor(null));
        props.navigation.canGoBack() && props.navigation.goBack();
        Toast.show({ description: 'Call ended!' });
    }

    return (
        <Box position="relative" flex={1}>
            <Box backgroundColor="gray.900" position="absolute" top="0" left="0" right="0" bottom="0">
                {/* VIDEO CALL */}
                {callState.infor?.type !== 'no-video' &&
                    (isRemoteVideoOn ? (
                        <RTCView
                            // @ts-ignore
                            streamURL={remoteStream?.toURL() || ''}
                            objectFit="cover"
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    ) : (
                        <HStack justifyContent="center" alignItems="center" bg="gray.900" w="100%" h="100%">
                            <VideoOffIcon size="20" color="white" />
                        </HStack>
                    ))}

                {callState.infor?.type === 'no-video' && (
                    <>
                        <VStack alignItems="center" position="relative" flex={1} pt="32">
                            <Box position="absolute" top="0" left="0" right="0" bottom="0">
                                {/* <Image
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                        source={{
                            uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                        }}
                        alt=""
                    /> */}

                                <Box
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    right="0"
                                    bottom="0"
                                    backgroundColor="black:alpha.60"
                                />
                            </Box>

                            <Image size="40" rounded="full" source={{ uri: remoteUser?.avatar }} alt="Avatar" />
                            <Text color="white" mt="5" fontSize={24} fontWeight="bold">
                                {remoteUser?.name}
                            </Text>
                            <HStack mt="2" justifyContent="center" alignItems="center" space="2">
                                <Box position="relative" size="4" rounded="full" bg="red.500">
                                    <Ring delay={0} />
                                    <Ring delay={400} />
                                    <Ring delay={800} />
                                </Box>
                                <Text color="gray.300" fontSize={12}>
                                    Calling...
                                </Text>
                            </HStack>
                        </VStack>
                    </>
                )}
            </Box>
            {callState.infor?.type !== 'no-video' && <LocalVideo isOnVideo={isOnVideo} stream={localStream} />}
            <VStack px="7" pt="24" pb="20" justifyContent="space-between" h="full">
                <Box>
                    {callState.infor?.type !== 'no-video' && (
                        <Text color="primary.900" fontWeight="bold" fontSize="32">
                            {remoteUser?.name}
                        </Text>
                    )}
                </Box>
                <HStack alignItems="center" justifyContent="center" space="10">
                    {/* MIC */}
                    <IconButton
                        onPress={handleToggleMic}
                        size={12}
                        bg="gray:900:alpha.50"
                        rounded="full"
                        icon={isOnMic ? <MicIcon size="lg" color="white" /> : <MicOffIcon size="lg" color="white" />}
                    />
                    {/* HANGUP */}

                    <IconButton
                        size="20"
                        rounded="full"
                        bg="primary.900"
                        icon={<PhoneIcon size="xl" color="white" />}
                        onPress={handleHangup}
                    />
                    {/* VOLUME */}
                    <IconButton
                        size={12}
                        bg="gray:900:alpha.50"
                        rounded="full"
                        onPress={handleToggleSpeaker}
                        icon={
                            isOnSpeaker ? (
                                <VolumeIcon size="xl" color={colors.primary[900]} />
                            ) : (
                                <VolumeIcon size="xl" color={colors.white} />
                            )
                        }
                    />
                </HStack>
            </VStack>
        </Box>
    );
};

const Ring = ({ delay }) => {
    const ring = useSharedValue(0);

    const ringStyle = useAnimatedStyle(() => {
        return {
            opacity: 0.8 - ring.value,
            transform: [
                {
                    scale: interpolate(ring.value, [0, 1], [0, 3]),
                },
            ],
        };
    });
    useEffect(() => {
        ring.value = withDelay(
            delay,
            withRepeat(
                withTiming(1, {
                    duration: 1600,
                }),
                -1,
                false,
            ),
        );
    }, []);
    return <Animated.View style={[styles.ring, ringStyle]} />;
};

const styles = StyleSheet.create({
    ring: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 99999,
        borderColor: '#ef4444',
        borderWidth: 2,
    },
});
