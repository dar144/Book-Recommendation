import React, { useState, useEffect } from "react";
import { fetchFollowRecommendations, followUser } from "../services/api";

const FollowRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                const { data } = await fetchFollowRecommendations();
                setRecommendations(data.recommendations || []);
            } catch (err) {
                setError("Failed to load recommendations.");
            } finally {
                setLoading(false);
            }
        };

        getRecommendations();
    }, []);

    const handleFollow = async (user) => {
        try {
            await followUser(user);
            setRecommendations((prev) => prev.filter((rec) => rec.user !== user));
        } catch (err) {
            console.error("Failed to follow user:", err);
        }
    };

    if (loading) return <p>Loading recommendations...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="follow-recommendations">
            <h2>Recommended Users to Follow</h2>
            {recommendations.length > 0 ? (
                <ul>
                    {recommendations.map((rec, index) => (
                        <li key={index}>
                            {rec.user} (Compatibility: {rec.compatibilityPercentage}%){" "}
                            <button onClick={() => handleFollow(rec.user)}>Follow</button>
                        </li>
                    ))}
                </ul>


            ) : (
                <p>No recommendations available.</p>
            )}
        </div>
    );
};

export default FollowRecommendations;
