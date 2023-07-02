import React, { useEffect, useState, useRef } from 'react';
import { Center, HStack, IconButton, Image, Pressable, Text, VStack, useTheme } from 'native-base';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { Feather, Ionicons } from '@expo/vector-icons';
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import {
    MediaStream,
    MediaStreamTrack,
    RTCIceCandidate,
    RTCPeerConnection,
    RTCSessionDescription,
    mediaDevices,
} from 'react-native-webrtc';
import { useAppDispatch, useAppSelector } from 'hooks/index';
import { CallState, callActions } from 'slice/call';
import sendCallMessage from 'utils/sendCallMessage';
import { MicIcon, MicOffIcon, PhoneIcon } from 'components/Icons/Light';
import { VolumeIcon } from 'components/Icons/Light/Volume';
import sendMessage from 'utils/sendMessage';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

const COMMING_CALL_TIMEOUT = 100000;

export const CallWaitingScreen = (props: RootStackScreenProps<RootNavigatekey.CallWaiting>) => {
    const { colors } = useTheme();
    const callState = useAppSelector((state) => state.call);
    const isCallCreated = useRef<Boolean>(false);
    const [isOnMic, setIsOnMic] = useState(true);
    const [isOnSpeaker, setIsOnSpeaker] = useState(true);
    const { toUser } = props.route.params;
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);
    console.log('🆓', localStream)

    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.primary[900],
            headerRight: () => (
                <HStack>
                    <Feather name="video" size={20} color={colors.primary[900]} />
                </HStack>
            ),
        });
    }, [props.navigation]);

    function handleToggleMic() {
        setIsOnMic(!isOnMic);
    }

    useEffect(() => {
        // if (!isFocused) return;
        initCall();
    }, []);

    useEffect(() => {
        // Check connection state
        const eventHandler = (event) => {
            console.log('🔌 Peer Connection State: ' + pc.current?.connectionState);
            if (pc.current?.connectionState === 'connected') {
                dispatch(callActions.changeCallState(CallState.Calling))
                // @ts-ignore
                props.navigation.replace(RootNavigatekey.Calling, {
                    pc: pc.current,
                    remoteStream,
                    localStream
                });
            }
            else if (
                pc.current?.connectionState === 'disconnected' ||
                pc.current?.connectionState === 'failed'
            ) {
                handleEndCall();
            }
        }
        pc.current?.addEventListener('connectionstatechange', eventHandler);

        return () => {
            pc.current?.removeEventListener('connectionstatechange', eventHandler);
        }
    }, [localStream, remoteStream])

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
    }, [callState]);

    async function initCall() {
        try {
            await setUpWebcamAndMediaStream();
            await createOffer(toUser);
        } catch (err) {
            props.navigation.goBack();
        }
    }

    async function setUpWebcamAndMediaStream() {
        pc.current = new RTCPeerConnection(servers);
        const local = await mediaDevices.getUserMedia({
            // video: {
            //     facingMode: 'environment',
            // },
            video: true,
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
            fromUser: user,
            toUser: toUser,
            createdAt: serverTimestamp(),
        });

        dispatch(callActions.changeCallState(CallState.Waiting));
        dispatch(callActions.changeCallInfor({ id: callDoc.id, toUser, fromUser: user }));
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
            sendMessage(toUser.deviceToken, {
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
        props.navigation.goBack();
    }

    return (
        <VStack flex={1} bg="gray.800" justifyContent="space-between" pt="32">
            {/* Avatar and name... */}
            <VStack alignItems="center">
                <Image
                    size="40"
                    rounded="full"
                    source={{ uri: callState.infor?.toUser?.avatar }}
                    alt="Avatar"
                />
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
                    onPress={handleCancelCall}
                />
                {/* VOLUME */}
                <IconButton
                    size={12}
                    bg="gray:900:alpha.50"
                    rounded="full"
                    // onPress={handleToggleSpeaker}
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
