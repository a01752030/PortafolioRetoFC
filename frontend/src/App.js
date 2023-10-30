import React, { useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard'

const poolData = {
  UserPoolId: 'us-east-2_I8C2RUTQi', 
  ClientId: '1vlrj7167oenhjh6a3sgor57ml'
};
const userPool = new CognitoUserPool(poolData);

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userGroup, setUserGroup] = useState("");

    useEffect(() => {
        const user = userPool.getCurrentUser();
        if (user) {
            user.getSession((err, session) => {
                if (err) {
                    console.error(err);
                    return;
                }
                if (session.isValid()) {
                    // This is a placeholder. In a real app, you would make a backend call here
                    // to fetch the group(s) the user belongs to.
                    fetchUserGroup(user.username)
                        .then(group => {
                            setIsLoggedIn(true);
                            setUserGroup(group);
                        })
                        .catch(err => {
                            console.error(err);
                        });
                }
            });
        }
    }, []);

    function fetchUserGroup(username) {
        // This is a placeholder logic. In reality, you'd call your backend which in turn 
        // calls AdminListGroupsForUser API of Cognito.
        return new Promise((resolve, reject) => {
            // Placeholder logic to mock group fetching:
            setTimeout(() => {
                if (username.startsWith('Admin')) {
                    resolve('AdminGroup');
                } else {
                    resolve('UserGroup');
                }
            }, 1000);
        });
    }

    function renderDashboard() {
        switch(userGroup) {
            case 'AdminGroup':
                return <Dashboard />;
            case 'UserGroup':
                return <UserDashboard />;
            default:
                return null; // or some generic dashboard or loading state
        }
    }

    return (
        <div className="App">
            { isLoggedIn ? renderDashboard() : <Login /> }
        </div>
    );
}

export default App;