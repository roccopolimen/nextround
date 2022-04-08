import connect from '../config/mongoConnection';
import { Collection, Db, ObjectId } from 'mongodb'
import { ApplicationObject, ContactObject, CycleObject, EventObject, MediaObject, UserObject } from '../typings';

const seedDB = async () => {

// DB SETUP
    const db: Db = await connect();

    try {
        await db.collection('users').drop();
    } catch(e) {
        // collection does not exist
    }

    try {
        await db.collection('cycles').drop();
    } catch(e) {
        // collection does not exist
    }

    try {
        await db.collection('media').drop();
    } catch(e) {
        // collection does not exist
    }

    const userCollection: Collection = db.collection('users');
    const cycleCollection: Collection = db.collection('cycles');
    const mediaCollection: Collection = db.collection('media');


// FUNCTIONS TO MAKE OBJECTS 
    const makeUser = (id: ObjectId, email: string, name: string): UserObject => {
        return {
            _id: id,
            email: email,
            name: name,
            cycles: []
        };
    };

    const makeMedia = (id: ObjectId, posterId: ObjectId, jobCycle: ObjectId, postDate: Date, content: string): MediaObject => {
        return {
            _id: id,
            posterId: posterId,
            jobCycle: jobCycle,
            postDate: postDate,
            content: content
        };
    };

    const makeCycle = (id: ObjectId, startDate: Date, endDate: Date): CycleObject => {
        return {
            _id: id,
            startDate: startDate,
            endDate: endDate,
            applications: []
        };
    };

    const makeApplication = (id: ObjectId, company: string, position: string,
                             location: string, salary: number, cardColor: string,
                             progress: number, jobPostUrl: string, description: string): ApplicationObject => {
        return {
            _id: id,
            company: company,
            position: position,
            location: location,
            salary: salary,
            cardColor: cardColor,
            progress: progress,
            jobPostUrl: jobPostUrl,
            description: description,
            notes: [],
            events: [],
            contacts: []
        };
    };

    const makeEvent = (id: ObjectId, status: boolean, title: string, date: Date, location: string): EventObject => {
        return {
            _id: id,
            status: status,
            title: title,
            date: date,
            location: location
        };
    };

    const makeContact = (id: ObjectId, name: string, pronouns: string, location: string, phone: string, email: string): ContactObject => {
        return {
            _id: id,
            name: name,
            pronouns: pronouns,
            location: location,
            phone: phone,
            email: email
        };
    };

    const addCycleToUser = (user: UserObject, cycleId: ObjectId): void => {
        user.cycles.push(cycleId);
    };

    const addApplicationToCycle = (cycle: CycleObject, application: ApplicationObject): void => {
        cycle.applications.push(application);
    };

    const addNoteToApplication = (application: ApplicationObject, note: string): void => {
        application.notes.push(note);
    };

    const addEventToApplication = (application: ApplicationObject, event: EventObject): void => {
        application.events.push(event);
    };

    const addContactToApplication = (application: ApplicationObject, contact: ContactObject): void => {
        application.contacts.push(contact);
    };

// DATA LISTS
    const listOfUsers: Array<UserObject> = [];
    const listOfCycles: Array<CycleObject> = [];
    const listOfMedia: Array<MediaObject> = [];

// CREATE USERS
    const michael: UserObject = makeUser(new ObjectId('624e16475be3fb3026fa8bb4'), 'mkarsen@stevens.edu',  'Michael Karsen');
    const rocco: UserObject   = makeUser(new ObjectId('624e169643afefcc06801ea2'), 'rpolimen@stevens.edu', 'Rocco Polimeni');
    const marco: UserObject   = makeUser(new ObjectId('624e16aa16662f0fa5a22f78'), 'mpolimen@stevens.edu', 'Marco Polimeni');
    const brian: UserObject   = makeUser(new ObjectId('624e16ad52210043ef57890a'), 'bwormser@stevens.edu', 'Brian Wormser');
    const grace: UserObject   = makeUser(new ObjectId('624e16b16bf9399b0f8d3687'), 'gmattern@stevens.edu', 'Grace Mattern');

// CREATE CYCLES
    const michaelFall: CycleObject = makeCycle(new ObjectId('624e956c4c06f2509b940b1d'), new Date('September 22, 2021'), new Date('December 20, 2021'));
    const roccoFall: CycleObject   = makeCycle(new ObjectId('624e36a9c78fc2142856b173'), new Date('September 22, 2021'), new Date('December 20, 2021'));
    const roccoSpring: CycleObject = makeCycle(new ObjectId('624e181fc086e2c5081110ca'), new Date('March 20, 2021'),     new Date('June 19, 2021'));
    const marcoSummer: CycleObject = makeCycle(new ObjectId('624e36b2ae8647ff7668ab04'), new Date('June 20, 2021'),      new Date('September 21, 2021'));
    const marcoFall: CycleObject   = makeCycle(new ObjectId('624e36ae80109e5a1cce8516'), new Date('September 22, 2021'), new Date('December 20, 2021'));
    const brianSpring: CycleObject = makeCycle(new ObjectId('624e36cf865d56f8a9a07c71'), new Date('March 20, 2021'),     new Date('June 19, 2021'));
    const graceWinter: CycleObject = makeCycle(new ObjectId('624e199cec15debf1e33b54a'), new Date('December 21, 2021'),  new Date('March 19, 2022'));
    
    addCycleToUser(michael, michaelFall._id);
    addCycleToUser(rocco, roccoFall._id);
    addCycleToUser(rocco, roccoSpring._id);
    addCycleToUser(marco, marcoSummer._id);
    addCycleToUser(marco, marcoFall._id);
    addCycleToUser(brian, brianSpring._id);
    addCycleToUser(grace, graceWinter._id);

// CREATE APPLICATIONS
    const google: ApplicationObject     = makeApplication(new ObjectId('624e1b08284261a838b3b96a'), 'Google', 'Software Engineer', 'Mountain View, CA, USA', 200000, '#4285F4', 0, 'https://careers.google.com/jobs/results/128310308272775878-software-engineer-iii/', `Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google's needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.`);
    const apple: ApplicationObject      = makeApplication(new ObjectId('624e26a1b4e252abfc0df7af'), 'Apple', 'Marchine Learning and AI', 'Seattle, WA, USA', 250000, '#A2AAAd', 1, 'https://jobs.apple.com/en-us/details/200332101/ai-ml-senior-software-engineer-information-intelligence?team=MLAI', `Design and build infrastructures to support features that empowers billions of Siri-search users. Perform language processing, statistical analysis, and query analysis to support your hypothesis for how to improve product-outcomes. Leverage proprietary MapReduce platform to process web scale data to deliver product features and improvements. Design & run/deploy various metrics and evaluations of features/improvements using a variety of tools like grading, logs processing, pre-launch and holdback A/Bs. Present results of analysis to team and leadership across Apple.`);
    const meta: ApplicationObject       = makeApplication(new ObjectId('624e26cb75ed26e2780fc29c'), 'Meta', 'Software Engineer', 'Los Angles, CA, USA', 180000, '#0668E1', 3, 'https://www.metacareers.com/v2/jobs/3109403942676506/', `Every month, billions of people access Facebook products using mobile devices from across the world. Our mobile teams constantly push the boundaries of the user experience across all our apps, including Facebook, Instagram, WhatsApp, Messenger, and more, as a leader in an exciting and fast-paced industry that is evolving daily. We are seeking full-time Android Software Engineers to join our mobile teams. As an Android Software Engineer, you will specialize in building elegant products on world-class technologies that bring our social experiences to billions of people, anytime and anywhere.`);
    const amazon: ApplicationObject     = makeApplication(new ObjectId('624e26d07329f6a33d8a57ff'), 'Amazon', 'Software Engineer', 'Seattle, WA, USA', 150000, '#FF9900', 2, 'https://www.amazon.jobs/en/jobs/996246/senior-software-dev-engineer', `Are you passionate about enterprise-wide scale compliance management? Are you excited about impactful technical projects that help our biggest enterprise customers manage hundreds of accounts with over a million resources across multiple regions? Amazon Web Services (AWS) is the pioneer and recognized leader in the Cloud. Our web services provide a platform for IT infrastructure that is used by hundreds of thousands of developers and businesses around the world. These customers range from start-ups to leading web companies to Global 500 companies in financial services, healthcare, and technology.`);
    const microsoft: ApplicationObject  = makeApplication(new ObjectId('624e26d661b4c200102d5382'), 'Microsoft', 'Software Engineer', 'Redmond, WA, USA', 150000, '#616161', 1, 'https://careers.microsoft.com/professionals/us/en/job/1218642/Senior-Software-Engineer', `We're looking for motivated engineers who want to solve interesting problems and lead change across teams. As an engineer in our team, you will work with senior and principal engineers in a specific feature area, collaborate with peers, and have the opportunity to mentor junior engineers. You will be hands-on in the development process which includes assisting with the authoring and reviewing of designs, writing and reviewing production code, and supporting our live services. This role will have a measurable impact on customer growth and satisfaction for one of the fastest growing businesses at Microsoft. We are looking for a senior software engineer, who thinks strategically, works pragmatically and with enthusiasm in a fast-moving environment with few guardrails. You will need strong customer empathy and an ability to focus our engineering efforts on customer requirements as well as Azure's business priorities. `);
    const hrt: ApplicationObject        = makeApplication(new ObjectId('624e26da9de60248dd4a6444'), 'Hudson River Trading', 'Software Engineer', 'New Yok, NY, USA', 300000, '#f99c3c', 0, 'https://www.hudsonrivertrading.com/careers/job/?gh_jid=75806&req_id=12', `Algo Software Engineers (AE) are programmers that work hand-in-hand with Algo Strategy Developers (AD). Whereas ADs tend to use their math skills to make smarter strategies, AEs focus on the software that powers trading and research. Because of this close collaboration, AEs tend to be the type of engineers that thrive on constant interaction and discussion. Hearing how their most recently deployed system allowed for whole new types of research would make their week. AEs are the type of engineers that don't mind juggling a few projects at once and have a varied portfolio of project types, from long-term ambitious new systems to fire-fighting live issues.`);
    const jpmorgan: ApplicationObject   = makeApplication(new ObjectId('624e26dfd69a37216d3041e5'), 'JPMorgan', 'Software Engineer Intern', 'Jersey City, NJ, USA', 30000, '#003594', 1, 'https://careers.jpmorgan.com/us/en/students/programs/software-engineer-fulltime', `Through our fulltime Software Engineer Program, you'll develop innovative solutions that impact the day-to-day lives of customers, clients and businesses around the world. You'll benefit from a $12 billion annual investment in technology, working in one of the world's biggest tech companies. You could design, build, deploy and run innovations across our cloud, cyber, digital, markets and payments businesses. You'll work in  an open, collaborative and supportive culture, where our agile teams are constantly innovating, learning new skills, and at the forefront of developing new technologies and solutions.`);
    const boa: ApplicationObject        = makeApplication(new ObjectId('624e26e30e2926813be93d33'), 'Bank of America', 'Data Scientist', 'London, United Kingdom', 120000, '#E61030', 3, 'https://careers.bankofamerica.com/en-us/job-detail/21039968/python-developer-software-engineer-london-united-kingdom', `The role offers the opportunity for involvement throughout the software development lifecycle and will include development of major green field components. There is significant buy-in from senior business partners and the successful candidate will gain experience of delivering directly to the business. Challenges currently being worked on include producing consistent, consolidated risk reports spanning the whole FICC business, running high-performance ticking intraday risk for trading desks, and explaining PNL across the global business. The team development environment is Quartz - the bank's next generation trading and risk platform. Quartz consists of various pieces of shared infrastructure and code to drive consolidation across the trading business and break down business specific silos. Development takes place almost entirely in Python, with some C++ for high performance components.`);
    const netflix: ApplicationObject    = makeApplication(new ObjectId('624e26e7353a313ed15cddb0'), 'Netflix', 'Research/Engineering Manager', 'Los Gatos, CA, USA', 250000, '#D81F26', 2, 'https://jobs.netflix.com/jobs/194899271', `We are looking for a manager to lead the Experience Personalization Algorithms Engineering team. In this role, you will lead the way for a team of machine learning researchers and engineers to develop the next generation of algorithms used to generate and select user experience modules, menus, artwork, trailers, metadata, and other assets shown on Netflix. This includes personalizing how we display recommendations to our members to help them find the best movie, TV show, or game (see this article for an example). This area focuses on machine learning areas around recommender systems, and bandit algorithms but also can include some elements of computer vision and natural language processing.`);
    const airbnb: ApplicationObject     = makeApplication(new ObjectId('624e26ed820e5131dac99cb2'), 'Airbnb', 'Software Engineer', 'San Francisco, CA, USA', 140000, '#FF585D', 1, 'https://careers.airbnb.com/positions/3929328/', `As a Staff Software Engineer, you will help us meet this challenge with innovative solutions that enable business agility, efficiency, and accuracy. You are eager to understand complex systems top to bottom and thrive working across technologies and codebases. In addition, you will excel at working through ambiguity, concept validation, and implementing a best-in-class solution.`);
    const tesla: ApplicationObject      = makeApplication(new ObjectId('624e26f11485ee32a8558d33'), 'Tesla', 'Software Engineer', 'Fremont, CA, USA', 190000, '#E31937', 2, 'https://www.tesla.com/careers/search/job/software-engineer-103501', `The mission of the development team is to build applications for Supply Chain and Service Operations. Working with Tesla's service, manufacturing, supply chain and Software teams to help design, develop and support world-class software systems that coordinate and manage flow of material to the service centers and coordinate replenishment and logistics with internal and external suppliers.`);
    const oracle: ApplicationObject     = makeApplication(new ObjectId('624e26f4e01e9fe61478b5dd'), 'Oracle', 'Software Engineer', 'Austin, TX, USA', 130000, '#FF0000', 4, 'https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/requisitions/preview/159239/?keyword=Software+Engineer&location=United+States&locationId=300000000149325&locationLevel=country', `Oracle's Healthcare Group is looking for a Java backend software engineer to join a growing microservices platform team.  We want to bring order to chaos and develop world class software that provides a far superior user experience, and we're doing this at every step of the way. We're looking for someone that can complement our development team and expand our capacity to deliver.`);
    const salesforce: ApplicationObject = makeApplication(new ObjectId('624e26f7e4fc2075cc5dd0f3'), 'Salesforce', 'Software Engineer', 'San Francisco, CA, USA', 180000, '#00A1E0', 2, 'https://salesforce.wd1.myworkdayjobs.com/en-US/External_Career_Site/job/Washington---Seattle/Software-Engineer_JR129393-1?d=cta-nav-sjb-1', `You will be responsible for ensure that the Tableau Online Identity services are trustworthy and reliable. These services are the very secure, highly available and are the are the entry point for the Tableau Online. We are continue to evolve the services as Cloud operations continue to demand a higher levels of security and to use the latest platform features to meet the expectations of large Enterprises. Tableau Online continues to be the fast growing product in Tableau and as such these service have to continue to scale to meet the increasing demand. Tableau Online is a hosted visual analysis product suite which allows people to share rich interactive stories about data. Thousands to millions of people will use your software, either directly by creating and contributing content, or indirectly by encountering it embedded into other sites on the Internet.`);
    const bloomberg: ApplicationObject  = makeApplication(new ObjectId('624e26fb85375bb9375ae04a'), 'Bloomberg', 'Software Engineer', 'New York, NY, USA', 160000, '#2800D7', 1, 'https://jobsearch.paypal-corp.com/en-US/job/software-engineer/J3P77L77HY42H8QZN6F', `The Consumer Engineering team builds user experiences used by millions of consumers across the globe. We are seeking Full Stack Engineer with hands-on in software development lifecycle experience to join us. You'll be a part of the “what” and “how” of the future of consumer applications and product development at PayPal. The successful candidate will work closely and collaboratively with cross functional teams during all phases of the software development lifecycle, and must have familiarity with Agile methodologies, test automation and release engineering. When you join us, you'll become part of our goal of making PayPal the best way to pay worldwide.`);
    
    addApplicationToCycle(michaelFall, microsoft);
    addApplicationToCycle(michaelFall, bloomberg);
    addApplicationToCycle(michaelFall, google);
    addApplicationToCycle(roccoFall, apple);
    addApplicationToCycle(roccoFall, meta);
    addApplicationToCycle(roccoSpring, hrt);
    addApplicationToCycle(roccoSpring, netflix);
    addApplicationToCycle(marcoSummer, tesla);
    addApplicationToCycle(marcoSummer, amazon);
    addApplicationToCycle(marcoFall, netflix);
    addApplicationToCycle(brianSpring, jpmorgan);
    addApplicationToCycle(brianSpring, airbnb);
    addApplicationToCycle(graceWinter, oracle);
    addApplicationToCycle(graceWinter, salesforce);
    addApplicationToCycle(graceWinter, boa);

// CREATE EVENTS

    // Google events
    const googleEvent1: EventObject = makeEvent(new ObjectId('624e26fb85375bb9375ae04a'), false, 'Apply',               new Date('September 24, 2021'), 'Online');
    const googleEvent2: EventObject = makeEvent(new ObjectId('624e324e7c4f596651ddba11'), false, 'Phone Interview',     new Date('September 27, 2021'), 'Phone');
    const googleEvent3: EventObject = makeEvent(new ObjectId('624e3253799a20c356c9cef7'), false, 'In Person Interview', new Date('October 10, 2021'),   'In Person');
    
    addEventToApplication(google, googleEvent1);
    addEventToApplication(google, googleEvent2);
    addEventToApplication(google, googleEvent3);

    // Apple events
    const appleEvent1: EventObject = makeEvent(new ObjectId('624e3256e0b7bde5c2634843'), true,  'Apply',               new Date('September 28, 2021'), 'Online');
    const appleEvent2: EventObject = makeEvent(new ObjectId('624e325a74555dc07f5cc1c4'), false, 'Phone Interview',     new Date('October 1, 2021'),    'Phone');
    const appleEvent3: EventObject = makeEvent(new ObjectId('624e3984d3c0dff0ef801fd2'), false, 'Technical Interview', new Date('October 5, 2021'),    'Online');
    const appleEvent4: EventObject = makeEvent(new ObjectId('624e325d6ffcd86beaf6b99d'), false, 'In Person Interview', new Date('October 12, 2021'),   'In Person');
    
    addEventToApplication(apple, appleEvent1);
    addEventToApplication(apple, appleEvent2);
    addEventToApplication(apple, appleEvent3);
    addEventToApplication(apple, appleEvent4);

    // Meta events
    const metaEvent1: EventObject = makeEvent(new ObjectId('624e325f1c62e84fab6b390f'), true, 'Apply',               new Date('September 20, 2021'), 'Online');
    const metaEvent2: EventObject = makeEvent(new ObjectId('624e3262676ebcef2a4a4fdb'), true, 'Phone Interview',     new Date('September 23, 2021'), 'Phone');
    const metaEvent3: EventObject = makeEvent(new ObjectId('624e32660ed84646f83ce09c'), true, 'Technical Interview', new Date('September 30, 2021'), 'Online');
    
    addEventToApplication(meta, metaEvent1);
    addEventToApplication(meta, metaEvent2);
    addEventToApplication(meta, metaEvent3);

    // Amazon events
    const amazonEvent1: EventObject = makeEvent(new ObjectId('624e326959f20a0932331466'), true, 'Apply',               new Date('June 25, 2021'), 'Online');
    const amazonEvent2: EventObject = makeEvent(new ObjectId('624e326c28190989e6555ec7'), true, 'Phone Interview',     new Date('June 30, 2021'), 'Phone');
    const amazonEvent3: EventObject = makeEvent(new ObjectId('624e326f124149fbc3ddf59c'), true, 'Technical Interview', new Date('July 5, 2021'),  'Online');
    const amazonEvent4: EventObject = makeEvent(new ObjectId('624e39c6ecb3a48dd0b60f5f'), true, 'In Person Interview', new Date('July 14, 2021'), 'In Person');
    
    addEventToApplication(amazon, amazonEvent1);
    addEventToApplication(amazon, amazonEvent2);
    addEventToApplication(amazon, amazonEvent3);
    addEventToApplication(amazon, amazonEvent4);

    // Microsoft events
    const microsoftEvent1: EventObject = makeEvent(new ObjectId('624e3272afc8bd8aa7fd09cd'), true,  'Apply',               new Date('October 5, 2021'),  'Online');
    const microsoftEvent2: EventObject = makeEvent(new ObjectId('624e32750d376ab4ebda7a13'), false, 'Phone Interview',     new Date('October 9, 2021'),  'Phone');
    const microsoftEvent3: EventObject = makeEvent(new ObjectId('624e327857414a900bed8f15'), false, 'Technical Interview', new Date('October 14, 2021'), 'Online');
    
    addEventToApplication(microsoft, microsoftEvent1);
    addEventToApplication(microsoft, microsoftEvent2);
    addEventToApplication(microsoft, microsoftEvent3);

    // HRT events
    const hrtEvent1: EventObject = makeEvent(new ObjectId('624e327b2428725014db7ddf'), false, 'Apply',               new Date('March 26, 2021'), 'Online');
    const hrtEvent2: EventObject = makeEvent(new ObjectId('624e327e9f51bd07e8480c04'), false, 'Phone Interview',     new Date('March 30, 2021'), 'Phone');
    const hrtEvent3: EventObject = makeEvent(new ObjectId('624e3281115427fee6306918'), false, 'Technical Interview', new Date('April 3, 2021'),  'Online');
    const hrtEvent4: EventObject = makeEvent(new ObjectId('624e3a48f0cce62a3e2bfe47'), false, 'In Person Interview', new Date('April 10, 2021'), 'In Person');
    const hrtEvent5: EventObject = makeEvent(new ObjectId('624e3a781b4ca271f3c6d2da'), false, 'Peer Interview',      new Date('April 12, 2021'), 'In Person');
    
    addEventToApplication(hrt, hrtEvent1);
    addEventToApplication(hrt, hrtEvent2);
    addEventToApplication(hrt, hrtEvent3);
    addEventToApplication(hrt, hrtEvent4);
    addEventToApplication(hrt, hrtEvent5);

    // JPMorgan events
    const jpmEvent1: EventObject = makeEvent(new ObjectId('624e3283622c59a07e43bf45'), true,  'Apply',               new Date('August 10, 2021'), 'Online');
    const jpmEvent2: EventObject = makeEvent(new ObjectId('624e32870f7e38bb3e667112'), false, 'Phone Interview',     new Date('August 13, 2021'), 'Phone');
    const jpmEvent3: EventObject = makeEvent(new ObjectId('624e32890b7ff5f93863306b'), false, 'Technical Interview', new Date('August 16, 2021'), 'Online');
    
    addEventToApplication(jpmorgan, jpmEvent1);
    addEventToApplication(jpmorgan, jpmEvent2);
    addEventToApplication(jpmorgan, jpmEvent3);

    // Bank of America events
    const boaEvent1: EventObject = makeEvent(new ObjectId('624e328c359f4c73586ca3b5'), true, 'Apply',               new Date('January 4, 2022'),  'Online');
    const boaEvent2: EventObject = makeEvent(new ObjectId('624e328f94869178a8c1b9c3'), true, 'Phone Interview',     new Date('January 7, 2022'),  'Phone');
    const boaEvent3: EventObject = makeEvent(new ObjectId('624e329277b5952a2121a3e9'), true, 'Technical Interview', new Date('January 14, 2022'), 'Online');
    
    addEventToApplication(boa, boaEvent1);
    addEventToApplication(boa, boaEvent2);
    addEventToApplication(boa, boaEvent3);

    // Netflix events
    const netflixEvent1: EventObject = makeEvent(new ObjectId('624e3295586193609ba847cf'), true, 'Apply',               new Date('November 5, 2021'),  'Online');
    const netflixEvent2: EventObject = makeEvent(new ObjectId('624e32978eeeb12e21965496'), true, 'Phone Interview',     new Date('November 8, 2021'),  'Phone');
    const netflixEvent3: EventObject = makeEvent(new ObjectId('624e329b14c7adca2034a372'), true, 'Technical Interview', new Date('November 13, 2021'), 'Online');
    const netflixEvent4: EventObject = makeEvent(new ObjectId('624e3aa0f02ff0a59c9a8522'), true, 'In Person Interview', new Date('November 20, 2021'), 'In Person');
    
    addEventToApplication(netflix, netflixEvent1);
    addEventToApplication(netflix, netflixEvent2);
    addEventToApplication(netflix, netflixEvent3);
    addEventToApplication(netflix, netflixEvent4);

    // Airbnb events
    const airbnbEvent1: EventObject = makeEvent(new ObjectId('624e32a1fe8cf8822b6a95c8'), true,  'Apply',               new Date('May 18, 2021'), 'Online');
    const airbnbEvent2: EventObject = makeEvent(new ObjectId('624e32a83f205bfc1b4ef3d6'), false, 'Phone Interview',     new Date('May 21, 2021'), 'Phone');
    const airbnbEvent3: EventObject = makeEvent(new ObjectId('624e32ab220f1d07a5e65a48'), false, 'In Person Interview', new Date('May 30, 2021'), 'In Person');
    
    addEventToApplication(airbnb, airbnbEvent1);
    addEventToApplication(airbnb, airbnbEvent2);
    addEventToApplication(airbnb, airbnbEvent3);

    // Tesla events
    const teslaEvent1: EventObject = makeEvent(new ObjectId('624e32ae8aac5c8f246d6cc1'), true, 'Apply',               new Date('July 7, 2021'),  'Online');
    const teslaEvent2: EventObject = makeEvent(new ObjectId('624e32b167b752c087805532'), true, 'Phone Interview',     new Date('July 11, 2021'), 'Phone');
    const teslaEvent3: EventObject = makeEvent(new ObjectId('624e32b44c22cee92f738e94'), true, 'Technical Interview', new Date('July 16, 2021'), 'Online');
    const teslaEvent4: EventObject = makeEvent(new ObjectId('624e3aaad146f4e35ad6512c'), true, 'In Person Interview', new Date('July 22, 2021'), 'In Person');
    
    addEventToApplication(tesla, teslaEvent1);
    addEventToApplication(tesla, teslaEvent2);
    addEventToApplication(tesla, teslaEvent3);
    addEventToApplication(tesla, teslaEvent4);

    // Oracle events
    const oracleEvent1: EventObject = makeEvent(new ObjectId('624e32b7e3c2a93080344db7'), true,  'Apply',               new Date('Febuary 3, 2022'),  'Online');
    const oracleEvent2: EventObject = makeEvent(new ObjectId('624e32ba43263a9c18551f75'), true,  'Phone Interview',     new Date('Febuary 6, 2022'),  'Phone');
    const oracleEvent3: EventObject = makeEvent(new ObjectId('624e32bc730509575dfdd6ed'), false, 'In Person Interview', new Date('Febuary 12, 2022'), 'In Person');
    
    addEventToApplication(oracle, oracleEvent1);
    addEventToApplication(oracle, oracleEvent2);
    addEventToApplication(oracle, oracleEvent3);

    // Salesforce events
    const salesforceEvent1: EventObject = makeEvent(new ObjectId('624e32bfea2deb8b92ed6885'), true, 'Apply',               new Date('March 1, 2022'),  'Online');
    const salesforceEvent2: EventObject = makeEvent(new ObjectId('624e32c297f7b96fea3c978f'), true, 'Phone Interview',     new Date('March 4, 2022'),  'Phone');
    const salesforceEvent3: EventObject = makeEvent(new ObjectId('624e32c62b99b9eb7564e7b7'), true, 'Technical Interview', new Date('March 10, 2022'), 'Online');
    const salesforceEvent4: EventObject = makeEvent(new ObjectId('624e3ba8cfa94fd794556d3a'), true, 'In Person Interview', new Date('March 16, 2022'), 'In Person');
    
    addEventToApplication(salesforce, salesforceEvent1);
    addEventToApplication(salesforce, salesforceEvent2);
    addEventToApplication(salesforce, salesforceEvent3);
    addEventToApplication(salesforce, salesforceEvent4);

    // Bloomberg events
    const bloombergEvent1: EventObject = makeEvent(new ObjectId('624e32c9b33b9492bcc2eb33'), true,  'Apply',               new Date('September 22, 2021'), 'Online');
    const bloombergEvent2: EventObject = makeEvent(new ObjectId('624e32d4ec4550d308eb7c4e'), false, 'Phone Interview',     new Date('September 25, 2021'), 'Phone');
    const bloombergEvent3: EventObject = makeEvent(new ObjectId('624e32d05cbbdb20b2867768'), false, 'Technical Interview', new Date('September 29, 2021'), 'Online');
    const bloombergEvent4: EventObject = makeEvent(new ObjectId('624e3bd1b606773034ea1142'), false, 'In Person Interview', new Date('October 4, 2021'),    'In Person');
    
    addEventToApplication(bloomberg, bloombergEvent1);
    addEventToApplication(bloomberg, bloombergEvent2);
    addEventToApplication(bloomberg, bloombergEvent3);
    addEventToApplication(bloomberg, bloombergEvent4);

// CREATE CONTACTS

    // Google contacts
    const googleContact1: ContactObject = makeContact(new ObjectId('624e6c2caa6fa6d3b4e69e72'), 'Peter	Jackson', 'he/him', 'location', '(987) 011-3615', 'pjackson@google.net');
    addContactToApplication(google, googleContact1);

    // Apple contacts
    const appleContact1: ContactObject = makeContact(new ObjectId('624e6c32731515cd2758d4ef'), 'Victor	Mills', 'he/him', 'location', '(297) 334-0517', 'vmills@apple.net');
    addContactToApplication(apple, appleContact1);

    // Meta contacts
    const metaContact1: ContactObject = makeContact(new ObjectId('624e6c351b0d313ec7849d23'), 'Matt Miller', 'he/him', 'location', '(985) 714-1627', 'mmiller@meta.net');
    addContactToApplication(meta, metaContact1);

    // Amazon contacts
    const amazonContact1: ContactObject = makeContact(new ObjectId('624e6c38f4786e42217ed8ad'), 'Peter Burgess', 'he/him', 'location', '(233) 275-9568', 'pburgess@amazon.net');
    addContactToApplication(amazon, amazonContact1);

    // Microsoft contacts
    const microsoftContact1: ContactObject = makeContact(new ObjectId('624e6c3c2ae281da0ba6c12a'), 'Dylan Bond', 'he/him', 'location', '(447) 660-9680', 'dbond@microsoft.com');
    addContactToApplication(microsoft, microsoftContact1);

    // HRT contacts
    const hrtContact1: ContactObject = makeContact(new ObjectId('624e6c40f697ee33f2bf5686'), 'Megan Payne', 'she/her', 'location', '(159) 735-9568', 'mpayne@hrt.net');
    addContactToApplication(hrt, hrtContact1);

    // JPMorgan contacts
    const jpmContact1: ContactObject = makeContact(new ObjectId('624e6c43bda4f0b6a52636ff'), 'Emily Sutherland', 'she/her', 'location', '(259) 609-5747', 'esuther@jpmorgan.com');
    addContactToApplication(jpmorgan, jpmContact1);

    // Bank of America contacts
    const boaContact1: ContactObject = makeContact(new ObjectId('624e6c466c8d16579ab273dc'), 'Connor Paige', 'he/him', 'location', '(521) 476-4591', 'cpaige@bofa.com');
    addContactToApplication(boa, boaContact1);

    // Netflix contacts
    const netflixContact1: ContactObject = makeContact(new ObjectId('624e6c49ae8e2e1911e19a65'), 'Mary	Dyer', 'she/her', 'location', '(106) 634-8114', 'mdyer@netflix.com');
    addContactToApplication(netflix, netflixContact1);

    // Airbnb contacts
    const airbnbContact1: ContactObject = makeContact(new ObjectId('624e6c4c0e49b28d57248fe0'), 'Owen Cameron', 'he/him', 'location', '(543) 295-4084', 'ocameron@airbnb.net');
    addContactToApplication(airbnb, airbnbContact1);

    // Tesla contacts
    const teslaContact1: ContactObject = makeContact(new ObjectId('624e6c507d3e7468c8bc7655'), 'Austin	Bower', 'he/him', 'location', '(926) 412-3368', 'abower@tesla.net');
    addContactToApplication(tesla, teslaContact1);

    // Oracle contacts
    const oracleContact1: ContactObject = makeContact(new ObjectId('624e6c52893bb7397e3e1768'), 'Joanne Allan', 'she/her', 'location', '(967) 824-6026', 'jallan@oracle.net');
    addContactToApplication(oracle, oracleContact1);

    // Salesforce contacts
    const salesforceContact1: ContactObject = makeContact(new ObjectId('624e6c562fa1e9a4691ed62a'), 'Joshua Lewis', 'he/him', 'location', '(207) 965-8964', 'jlewis@salesforce.com');
    addContactToApplication(salesforce, salesforceContact1);

    // Bloomberg contacts
    const bloombergContact1: ContactObject = makeContact(new ObjectId('624e6c59b9a243097f967952'), 'Joseph Glover', 'he/him', 'location', '(976) 813-9168', 'jglover@bloomberg.net');
    addContactToApplication(bloomberg, bloombergContact1);

// CREATE NOTES

    addNoteToApplication(google, 'Make sure to get a good nights sleep!');
    addNoteToApplication(apple, 'Do research on how the company handles their data');
    addNoteToApplication(meta, 'Study leetcode because thats all they care about');
    addNoteToApplication(amazon, 'Everything past the technical interview is a cake walk');
    addNoteToApplication(microsoft, 'Leet code, Leet code, Leet code');
    addNoteToApplication(hrt, 'Prepare like Eric for the olympics');
    addNoteToApplication(jpmorgan, 'Easy interview questions wont be a challenge');
    addNoteToApplication(boa, '@bofa.com lol');
    addNoteToApplication(netflix, 'Marcos dream job dont let him down!');
    addNoteToApplication(airbnb, 'Prepare for interview questions listed on their website');
    addNoteToApplication(tesla, 'Review old projects to be ready to explain them');
    addNoteToApplication(oracle, 'Oracle cloud may be the inferior cloud service but I need this job');
    addNoteToApplication(salesforce, 'Every company loves this service, but workday is on another level of ...');
    addNoteToApplication(bloomberg, 'Prepare for questions on binary trees');

    
//CREATE MEDIA
    
    // Post 1
    const michaelPost: MediaObject = makeMedia(new ObjectId('624e7432b9bd8ffe79422272'), michael._id, michaelFall._id, new Date('December 19, 2021'), 'I absolutely killt it you already know!');

    // Post 2
    const roccoPost: MediaObject = makeMedia(new ObjectId('624e743cd787b4472fbe1dc6'), rocco._id, roccoSpring._id, new Date('June 18, 2021'), 'I\'m a straight clown no cap, gonna have to hit myself with a chop on foenem ( 。ヘ °)');

    // Post 3
    const marcoPost: MediaObject = makeMedia(new ObjectId('624e743fce646315d8c99d4b'), marco._id, marcoFall._id, new Date('December 19, 2021'), 'Hopefully this job is able to purchase my dad that beach house he always wanted :D');
    
    // Post 4
    const brianPost: MediaObject = makeMedia(new ObjectId('624e7446030bb2f1a8a9d3b6'), brian._id, brianSpring._id, new Date('June 17, 2021'), 'Brian more like brain');

    // Post 5
    const gracePost: MediaObject = makeMedia(new ObjectId('624e744a074e859c77121e2e'), grace._id, graceWinter._id, new Date('March 19, 2022'), 'I GOT THE JOB WOOT WOOT');


// INSERT DATA INTO DATABASE

    listOfUsers.push(michael, rocco, marco, brian, grace);
    await userCollection.insertMany(listOfUsers);

    listOfCycles.push(michaelFall, roccoFall, roccoSpring, marcoFall, marcoSummer, brianSpring, graceWinter);
    await cycleCollection.insertMany(listOfCycles);

    listOfMedia.push(michaelPost, roccoPost, marcoPost, brianPost, gracePost);
    await mediaCollection.insertMany(listOfMedia);

    return 'all done!';
}

export default seedDB;