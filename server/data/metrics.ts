import { cycles } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { checkObjectId } from '../helpers/error';
import { CycleObject, MetricsObject } from '../typings';

/**
 * @description Gets metric data for cycle with given id
 * @param {string} id Cycle id
 * @returns {Promise<MetricsObject>} Metrics object
 */
export const getMetricsByID = async (id: string): Promise<MetricsObject> => {
    if(!checkObjectId(id)){
        throw new Error('Invalid id');
    }

    const cycleCollection = await cycles();
    const cycle: CycleObject = await cycleCollection.findOne({
        _id: new ObjectId(id)});
    if(cycle === null)
        throw new Error("There is no cycle with that id.");

    // Set up variables for metrics object
    let num_saved: number = 0;
    let num_applications: number = 0;
    let num_interviewed: number = 0;
    let num_offers: number = 0;
    let num_rejections: number = 0;
    let num_rounds: number = 0;
    let avg_salary: number = 0;
    let num_connections: number = 0;
    let application_timeline: Array<Date> = [];

    let salaries: Array<number> = [];

    for(let app of cycle.applications) { // For each application
        num_saved++; // another saved application
        let interview_flag = false;

        for(let event of app.events) { // For each event
            if(event.title === "Apply" && event.status === true) {
                num_applications++; // another application
                application_timeline.push(event.date); // add to timeline
            } else if(event.title !== "Saved" && event.status === true) {
                if(!interview_flag) {
                    num_interviewed++; // another interviewed application
                    interview_flag = true;
                }
                num_rounds++; // another round
            }
        }

        if(app.progress === 1) {
            num_offers++; // another offer
            if(app.salary !== null)
                salaries.push(app.salary); // add to salaries
        } else if(app.progress === 2) {
            num_rejections++; // another rejection
        }
        num_connections += app.contacts.length; // add to connections
    }

    avg_salary = salaries.length === 0 ? 0 :
     salaries.reduce((a, b) => a + b) / salaries.length;
    
    // sort application timeline
    application_timeline.sort((a, b) => {
        if(a > b) return 1;
        if(a < b) return -1;
        return 0;
    });
    
    let metrics: MetricsObject = {
        num_saved: num_saved,
        num_applications: num_applications,
        num_interviewed: num_interviewed,
        num_offers: num_offers,
        num_rejections: num_rejections,
        num_rounds: num_rounds,
        avg_salary: avg_salary,
        num_connections: num_connections,
        application_timeline: application_timeline
    };
    return metrics;
}