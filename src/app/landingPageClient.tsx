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
                       Bring your business data into one powerful, centralized dashboard. Our platform integrates with
                        Stripe to give your team a unified view of customers, orders, subscriptions, revenue, and other business activity.
                        Import customers and orders directly from Stripe, or upload your data using CSV files. Manage your
                        customer and order data from a single workspace, with the flexibility to bring existing business
                        data into the platform.
                        Built around an organization-based workflow, the platform makes it easy to add team members
                        and assign permissions based on their responsibilities. Give the right people access to the
                        information and tools they need while keeping your organization's data controlled and organized.
                        The built-in ticketing system allows authorized team members to create, assign, and manage tickets
                        efficiently. Team members can collaborate through discussions, updates, and comments, keeping customer
                        issues and internal tasks organized and transparent.
                        For administrators, the activity logging system provides visibility into important organizational actions.
                        Track user activity and maintain accountability with detailed audit logs.
                        Whether you're managing customers, orders, subscriptions, support tickets,
                        or team activity, the platform brings your operational data and workflows
                        together in one centralized workspace—giving your organization the clarity and control
                        it needs to work more efficiently and scale with confidence.
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