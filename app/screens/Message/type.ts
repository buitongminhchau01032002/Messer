import { FieldValue, Timestamp } from 'firebase/firestore';

export enum SendType {
    Send = 'Send',
    Receive = 'Receive',
}

export type SingleRoom = any;
export type Room = any;
export type Message = {
    id?: string;
    replyMessage?: Message | string;
    content?: string;
    createdAt: Timestamp | FieldValue;
    fileIds?: any[];
    sender: User | string;
    type: 'text' | 'image' | 'file' | 'notification';
};
export type User = {
    id: string;
    avatar?: string;
    name: string;
};
