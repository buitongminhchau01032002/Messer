import { FieldValue, Timestamp } from 'firebase/firestore';

export enum SendType {
    Send = 'Send',
    Receive = 'Receive',
    Notice = 'Notice',
}

export type SingleRoom = {
    id?: string;
    lastMessages?: string;
    reads: [];
    user1: string;
    user2: string;
};

export type MultiRoom = {
    id?: string;
    lastMessages?: string;
    reads: [];
    users: [];
};
export type Room = any;
export type Message = {
    id?: string;
    replyMessage?: Message | string;
    content?: string;
    createdAt: Timestamp | FieldValue;
    sender: User | string;
    fileIds?: string[];
    type: 'text' | 'image' | 'media' | 'notification' | 'story';
    isDeleted: boolean;
};
export type Media = {
    id?: string;
    url: string;
    type: 'image' | 'video';
    isDeleted: boolean;
};
export type User = {
    id: string;
    avatar?: string;
    name: string;
};
