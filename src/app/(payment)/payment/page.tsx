'use client'

import { useState, useEffect, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import ApiService from "@/utils/ApiService";
import { useRouter } from "next/navigation";

interface AllPlan {
    id: string;
    name: string;
    description: string;
    credits: number;
    price: number;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const StripePlan = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [getPlan, setGetPlan] = useState<AllPlan[]>([]);
    // const apiURL = process.env.NEXT_PUBLIC_API_URL;

    const apiService = useMemo(() => new ApiService("http://192.168.136.127:8000"), []);

    const tofirstpage = () => {
        router.push('/kwgenerate')
    }

    const checkoutsetting = async (plan: AllPlan) => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // const response = await axios.post(
            //     'http://192.168.136.127:8000/stripe/create-checkout-session', // Adjust this endpoint as needed
            //     { planId: plan.id },
            //     {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${token}`
            //         }
            //     }
            // );

            apiService.setToken(token);
            const response = await apiService.createCheckoutSession(plan.id)

            console.log("Checkout response:", response);
            if (response.sessionId) {
                const stripe = await stripePromise;
                if (stripe) {
                    const { error } = await stripe.redirectToCheckout({
                        sessionId: response.sessionId
                    });
                    
                    if (error) {
                        console.error("Error redirecting to checkout:", error);
                    }
                } else {
                    console.error("Stripe has not been initialized");
                }
            } else if (response.url) {
                // If the backend provides a direct URL, use it
                window.location.href = response.url;
            } else {
                console.error("No sessionId or URL received from the server");
            }
          
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Failed to create checkout session:", error.response?.data || error.message);
            } else {
                console.error("Failed to create checkout session:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchPlan = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await apiService.getPlans();
                setGetPlan(response.data.allPlan);

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log("Failed to fetch keywords:", error.response?.data || error.message);
                } else {
                    console.log("Failed to fetch keywords:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlan();
    }, [apiService]);

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas
                        in. Explicabo id ut laborum.
                    </p>
                </div>
                <div className="rounded-2xl bg-white py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:justify-center lg:py-16 mt-8">
                    {getPlan.map((plan => (
                        <div key={plan.id} className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                <div className="mx-auto max-w-xs px-8">
                                    <p className="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">${plan.price}</span>
                                        <span className="text-base font-semibold leading-6 tracking-wide text-gray-600">/{plan.credits}credit</span>
                                    </p>
                                    <div
                                        onClick={() => checkoutsetting(plan)}
                                        className="cursor-pointer mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Get access
                                    </div>
                                    <p className="mt-6 text-xs leading-5 text-gray-600">
                                        {plan.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )))}
                </div>
                <div className="mx-auto max-w-2xl sm:text-center mt-8">
                    <p onClick={tofirstpage} className="text-[20px] cursor-pointer hover:text-gray-900 tracking-tight text-gray-600 sm:text-2xl">First Page</p>
                </div>
            </div>
        </div>
    )
}

export default StripePlan;