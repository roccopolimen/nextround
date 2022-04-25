import { ObjectId } from 'mongodb';

declare module "*.json" {
    const value: any;
    export default value;
}

interface UserObject {
    _id: ObjectId,
    firebaseId: string,
    email: string,
    name: string,
    cycles: Array<ObjectId>
}

interface CycleObject {
    _id: ObjectId,
    startDate: Date,
    endDate: Date,
    applications: Array<ApplicationObject>
}

interface MediaObject {
    _id: ObjectId,
    posterId: ObjectId,
    jobCycle: ObjectId,
    postDate: Date,
    content: string
}

interface ApplicationObject {
    _id: ObjectId,
    company: string,
    position: string,
    location: string,
    salary: number,
    cardColor: string,
    progress: number,
    jobPostUrl: string,
    description: string,
    notes: Array<string>,
    events: Array<EventObject>,
    contacts: Array<ContactObject>
}

interface EventObject {
    _id: ObjectId,
    status: boolean,
    title: string,
    date: Date,
    location: string
}

interface ContactObject {
    _id: ObjectId,
    name: string,
    pronouns: string,
    location: string,
    phone: string,
    email: string
} 