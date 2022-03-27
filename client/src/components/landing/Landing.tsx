import React from "react";
import './Landing.css'
// TODO import './ResponsiveLanding.css'

export const Landing = () => {
    return (
        <>
            <div className="container-center-horizontal">
                <div className="landing-page screen">
                    <div className="landing-design-v1">
                    <div className="nav-bar">
                        {/* TODO put logo here */}
                        {/* TODO maybe put a login hyperlink */}
                    </div>
                    <div className="content">
                        <div className="heading-logo">
                        <div className="heading-cta">
                            <div className="heading-text">
                            <h1 className="find-the-most-exciti header-1">NextRound</h1>
                            <p className="vestibulum-placerat paragraph">Track your job applications all in one place with NextRound’s unique features that will help you land the job of your dreams! Ditch those spreadsheets; keep all the important information and upcoming events for each job application on site with a user experience tailored for the job seeker.</p>
                            </div>
                            <div className="cta-button">
                            <div className="cta-02">
                                <div className="button-text buttons">Sign up</div>
                            </div>
                            <div className="cta-01 border-1px-eye-catch">
                                <div className="button-text-1 buttons">Log in</div>
                            </div>
                            </div>
                        </div>
                        <div className="logo-cloud">
                            <div className="heading sub-header">Track Applications for Top Companies</div>
                            <div className="logos">
                                <img className="google-logo-colour" src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"/>
                                <img className="netflix-logo-colour" src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"/>
                                <img className="amazon-logo-colour" src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"/>
                                <img className="spotify-logo-colour" src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"/>
                            </div>
                        </div>
                        </div>
                        {/* TODO insert featured img here or something */}
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Landing;