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
    endDate: Date | null,
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
    companyLogo: string,
    position: string,
    location: string,
    salary: number | null,
    cardColor: string,
    progress: number, // 0 (IP) - 1 (Offer) - 2 (Reject) - 3 (Waitlist) - 4 (TBD)
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
    phone: string,
    email: string
}

interface MetricsObject {
    // Job Funnel
    num_saved: number,
    num_applications: number,
    num_interviewed: number,
    num_offers: number,
    // Other metrics
    num_rejections: number,
    num_rounds: number,
    avg_salary: number,
    num_connections: number,
    application_timeline: Array<Date>
}

interface ForumPostObject {
    _id: ObjectId,
    poster: ObjectId,
    jobCycle: ObjectId,
    postDate: Date,
    content: string,
    metrics: MetricsObject
}

interface Failure {
    message: string,
    error?: string
}

interface UpcomingObject {
    eventId: ObjectId,
    applicationId: ObjectId,
    companyLogo: string,
    company: string, 
    role: string, 
    date: Date, 
    title: string,
    status: boolean
}

