"use client";

import { useState, useEffect, MouseEventHandler } from "react";
import  Main  from "../components/partials/main";
import { useRouter} from "next/navigation";





export default function LandingPageClient(){

    const router =  useRouter();
    const handleOpenLogin = () =>
    {
        router.push('/login',{scroll:false});
    }
    const handleOpenRegister = ()=>
    {
        router.push('/register',{scroll:false});
    }

return(
    <Main className="landingMain">
        <div className="businessCardWrapper">
            <div className="businessCard">
                <div className="businessInfo">
                    <h1 className="cardHeader">Welcome to C-Board,Gain Complete Visibility Into Your Business</h1>
                    <p className="businessDesc">
                        Bring all your business data into one powerful dashboard.
                        Our platform integrates with Stripe and other essential
                        services to give your team a unified view of customers,
                        orders, subscriptions, revenue, and operational activity—all
                        in real time.
                        Monitor key business metrics, track customer growth, manage subscription lifecycles,
                        and analyze performance from a single, centralized workspace. No more switching between
                        multiple tools or dashboards.
                        Built for collaboration, the platform includes a powerful ticketing system that
                        enables authorized team members to create, assign, and manage tickets efficiently.
                        Team members can collaborate through discussions, updates, and comments,
                        ensuring every issue and task stays organized and transparent.
                        For administrators, the built-in activity logging system provides
                        complete visibility into organizational actions. Track important events,
                        monitor user activity, and maintain accountability across your entire team with detailed audit logs.
                        Whether you're managing subscriptions, supporting customers,
                        tracking operations, or overseeing team activity, our platform provides the clarity and control your organization needs to scale with confidence.
                    </p>
                </div>
                <div className="authCol">
                    <button id="signup" 
                     onClick={handleOpenRegister}>Get Started</button>
                    <button id="signin"
                    onClick={handleOpenLogin}>Sign in</button>
                </div>
            </div>
        </div>
    </Main>
)

}