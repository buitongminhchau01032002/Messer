import React, { useEffect, useRef, useState } from 'react';
import { Box, Center, HStack, IconButton, Image, Text, VStack, useTheme } from 'native-base';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { LocalVideo } from './components/LocalVideo';
import { MicIcon, MicOffIcon, PhoneIcon } from 'components/Icons/Light';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    mediaDevices,
} from 'react-native-webrtc';
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import { useIsFocused } from '@react-navigation/native';
import { useAppSelector } from 'hooks/index';
import sendCallMessage from 'utils/sendCallMessage';
import { useDispatch } from 'react-redux';
import { CallState, callActions } from 'slice/call';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

export const CallingScreen = (props: RootStackScreenProps<RootNavigatekey.Calling>) => {
    const { colors } = useTheme();
    const [isOnMic, setIsOnMic] = useState(true);
    const callState = useAppSelector((state) => state.call);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.primary[900],
        });
    }, [props.navigation]);

    useEffect(() => {
        if (!isFocused) return;
        initCall();
    }, [isFocused]);

    async function initCall() {
        await setUpWebcamAndMediaStream();
        await joinCall(callState.infor?.id);
    }

    function handleToggleMic() {
        console.log('sadfasdf');
        setIsOnMic(!isOnMic);
    }

    async function setUpWebcamAndMediaStream() {
        pc.current = new RTCPeerConnection(servers);
        const local = await mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        // pc.current.addStream(local);
        setLocalStream(local);
        let remote = new MediaStream(undefined);
        setRemoteStream(remote);

        // Check connection state
        pc.current.addEventListener('connectionstatechange', (event) => {
            console.log('🔌 Peer Connection State: ' + pc.current?.connectionState);
        });

        // Push tracks from local stream to peer connection
        local.getTracks().forEach((track) => {
            pc.current?.addTrack(track, local);
        });

        // Pull tracks from remote stream, add to video stream
        pc.current.ontrack = (event: any) => {
            remote.addTrack(event.track);
            setRemoteStream(remote);
        };
    }

    async function joinCall(docId: any) {
        const callDoc = doc(db, 'calls', docId);
        const offerCandidates = collection(db, 'calls', docId, 'offerCandidates');
        const answerCandidates = collection(db, 'calls', docId, 'answerCandidates');

        pc.current.onicecandidate = async (event: any) => {
            if (event.candidate) {
                await addDoc(answerCandidates, event.candidate.toJSON());
            }
        };

        const callDocument = await getDoc(callDoc);
        const callData = callDocument.data();

        const offerDescription = callData?.offer;

        await pc.current?.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await pc.current?.createAnswer();
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

    function handleHangup() {
        localStream &&
            localStream.getTracks().forEach((track) => {
                track.stop();
            });

        remoteStream &&
            remoteStream.getTracks().forEach((track) => {
                track.stop();
            });
        pc.current && pc.current.close();

        dispatch(callActions.changeCallState(CallState.NoCall));
        dispatch(callActions.changeCallInfor(null));

        // this is from user
        //if (callInfo.fromUser.id === user.id) {
        // sendCallMessage(callInfo.toUser.device, {
        //     type: 'hangup',
        //     docId: callInfo.id,
        // });
        //}

        // this is to user
        // if (callInfo.toUser.id === user.id) {
        sendCallMessage(callState.infor?.fromUser?.device, {
            type: 'hangup',
            docId: callState.infor?.id,
        });
        props.navigation.goBack();
        // }
    }

    return (
        <Box position="relative" flex={1}>
            <Box position="absolute" top="0" left="0" right="0" bottom="0">
                {/* VIDEO CALL */}
                <RTCView
                    streamURL={remoteStream?.toURL() || ''}
                    objectFit="cover"
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                    mirror
                />
                <Image
                    h="full"
                    w="full"
                    source={{
                        uri: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
                    }}
                    alt=""
                />
            </Box>
            <LocalVideo />
            <VStack px="7" pt="24" pb="20" justifyContent="space-between" h="full">
                <Box>
                    <Text color="primary.900" fontWeight="bold" fontSize="32">
                        Erika
                    </Text>
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
                        icon={
                            isOnMic ? (
                                <Feather name="volume" size={24} color={colors.white} />
                            ) : (
                                <Feather name="volume" size={24} color={colors.white} />
                            )
                        }
                    />
                </HStack>
            </VStack>
        </Box>
    );
};
