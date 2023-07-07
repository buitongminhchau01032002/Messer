import React, { useEffect, useState, useRef } from 'react';
import { Box, HStack, IconButton, Image, Text, Toast, VStack, useTheme } from 'native-base';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { Feather } from '@expo/vector-icons';
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import {
    MediaStream,
    MediaStreamTrack,
    RTCIceCandidate,
    RTCPeerConnection,
    RTCSessionDescription,
    RTCView,
    mediaDevices,
} from 'react-native-webrtc';
import { useAppDispatch, useAppSelector } from 'hooks/index';
import { CallState, callActions } from 'slice/call';
import sendCallMessage from 'utils/sendCallMessage';
import { MicIcon, MicOffIcon, PhoneIcon } from 'components/Icons/Light';
import { VolumeIcon } from 'components/Icons/Light/Volume';
import { Alert } from 'react-native';
import { BackHandler } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { SwitchCameraIcon } from 'components/Icons/Light/SwitchCamera';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

const COMMING_CALL_TIMEOUT = 30000;

export const CallWaitingScreen = (props: RootStackScreenProps<RootNavigatekey.CallWaiting>) => {
    const { colors } = useTheme();
    const callState = useAppSelector((state) => state.call);
    const isCallCreated = useRef<Boolean>(false);
    const [isOnMic, setIsOnMic] = useState(true);
    const [isOnSpeaker, setIsOnSpeaker] = useState(true);
    const [isOnVideo, setIsOnVideo] = useState(true);
    const { toUser, type } = props.route.params;
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);
    // console.log('🆓', localStream);

    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.primary[900],
            headerBackVisible: false,
            headerRight: () => (
                <HStack>
                    {/* <Feather name="video" size={20} color={colors.primary[900]} /> */}
                    <IconButton
                        rounded="full"
                        onPress={handleSwitchCamera}
                        icon={<SwitchCameraIcon size="xl" color={colors.primary[900]} />}
                    />
                </HStack>
            ),
        });
    }, [props.navigation, localStream]);

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
        setIsOnSpeaker(!isOnSpeaker);
    }
    function handleSwitchCamera() {
        localStream?.getVideoTracks()[0]._switchCamera();
    }

    useEffect(() => {
        // if (!isFocused) return;
        const unsub = initCall();

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                'Hang up',
                'Do you want to hang up now!',
                [
                    { text: 'Keep call', style: 'cancel', onPress: () => {} },
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
        return () => { backHandler.remove();}
    }, []);

    useEffect(() => {
        // Check connection state
        const eventHandler = (event: any) => {
            console.log('🔌 Peer Connection State: ' + pc.current?.connectionState);
            if (pc.current?.connectionState === 'connected') {
                dispatch(callActions.changeCallState(CallState.Calling));
                // @ts-ignore
                props.navigation.replace(RootNavigatekey.Calling, {
                    pc: pc.current,
                    remoteStream,
                    localStream,
                    isOnMic,
                    isOnSpeaker,
                });
            } else if (pc.current?.connectionState === 'disconnected' || pc.current?.connectionState === 'failed') {
                handleEndCall();
            }
        };
        pc.current?.addEventListener('connectionstatechange', eventHandler);

        return () => {
            pc.current?.removeEventListener('connectionstatechange', eventHandler);
        };
    }, [localStream, remoteStream, isOnMic, isOnSpeaker]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleCancelCall();
        }, COMMING_CALL_TIMEOUT);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (callState.state === CallState.NoCall) {
            isCallCreated.current && handleEndCall();
        }
        if (callState.state === CallState.Calling) {
            // @ts-ignore
            props.navigation.replace(RootNavigatekey.Calling, {
                pc: pc.current,
                remoteStream,
                localStream,
                isOnMic,
                isOnSpeaker,
            });
        }
    }, [callState, remoteStream, localStream, isOnMic, isOnSpeaker]);

    async function initCall() {
        let ubsub = () => {};
        try {
            await setUpWebcamAndMediaStream();
            await createOffer(toUser);
        } catch (err) {
            props.navigation.goBack();
        } finally {
            return ubsub;
        }
    }

    async function setUpWebcamAndMediaStream() {
        pc.current = new RTCPeerConnection(servers);
        const local = await mediaDevices.getUserMedia({
            video: type === 'no-video' ? false : true,
            audio: true,
        });
        pc.current?.addStream(local);
        setLocalStream(local);
        let remote = new MediaStream(undefined);
        setRemoteStream(remote);

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

    async function createOffer(toUser: any) {
        // Reference Firestore collections for signaling
        const callDoc = doc(collection(db, 'calls'));
        const offerCandidates = collection(db, 'calls', callDoc.id, 'offerCandidates');
        const answerCandidates = collection(db, 'calls', callDoc.id, 'answerCandidates');

        // Get candidates for caller, save to db
        pc.current!.onicecandidate = async (event: any) => {
            if (event.candidate) {
                addDoc(offerCandidates, event.candidate.toJSON());
            }
        };

        // create offer
        const offerDescription: RTCSessionDescription = (await pc.current?.createOffer(
            undefined,
        )) as RTCSessionDescription;
        await pc.current?.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        await setDoc(callDoc, {
            offer,
            fromUser: { ...user, isOnVideo: true },
            toUser: { ...toUser, isOnVideo: true },
            type,
            createdAt: serverTimestamp(),
        });

        dispatch(callActions.changeCallState(CallState.Waiting));
        dispatch(callActions.changeCallInfor({ id: callDoc.id, type, toUser, fromUser: user }));
        sendCallMessage(toUser.deviceToken, {
            type: 'create',
            docId: callDoc.id,
        });
        isCallCreated.current = true;

        // Listen for remote answer
        onSnapshot(callDoc, (snapshot) => {
            const data = snapshot.data();
            // @ts-ignore
            if (!pc.current?.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.current?.setRemoteDescription(answerDescription);
            }
        });

        // When answered, add candidate to peer connection
        onSnapshot(answerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    pc.current?.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });

    }

    async function handleCancelCall() {
        try {
            sendCallMessage(toUser.deviceToken, {
                type: 'cancel',
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
        <VStack flex={1} bg="gray.800" justifyContent="space-between">
            {/* Avatar and name... */}
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
                    {type !== 'no-video' && (
                        <RTCView
                            // @ts-ignore
                            streamURL={localStream?.toURL() || ''}
                            objectFit="cover"
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                            mirror
                        />
                    )}
                    <Box position="absolute" top="0" left="0" right="0" bottom="0" backgroundColor="black:alpha.60" />
                </Box>

                <Box position="relative" size="40" rounded="full">
                    <Ring delay={0} />
                    <Ring delay={250} />
                    <Ring delay={500} />
                    <Image
                        position="absolute"
                        size="40"
                        bg="gray.500"
                        rounded="full"
                        source={{ uri: callState.infor?.toUser?.avatar }}
                        alt=""
                    />
                </Box>
                <Text color="white" mt="5" fontSize={24} fontWeight="bold">
                    {callState.infor?.toUser?.name}
                </Text>
                <Text color="gray.300" mt="2" fontSize={12}>
                    Waiting...
                </Text>
            </VStack>

            {/* Button Action */}
            <HStack bg="amber.500" pb="20" pt="20" alignItems="center" justifyContent="center" space="10">
                <IconButton
                    onPress={handleToggleMic}
                    size={12}
                    rounded="full"
                    icon={isOnMic ? <MicIcon size="lg" color="white" /> : <MicOffIcon size="lg" color="white" />}
                />
                {/* HANGUP */}

                <IconButton
                    size="20"
                    rounded="full"
                    bg="primary.900"
                    icon={<PhoneIcon size="xl" color="white" />}
                    onPress={handleCancelCall}
                />
                {/* VOLUME */}
                <IconButton
                    size={12}
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
        width: 160,
        height: 160,
        borderRadius: 99999,
        borderColor: 'white',
        borderWidth: 3,
    },
});
