import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-2_I8C2RUTQi',
    ClientId: '1vlrj7167oenhjh6a3sgor57ml'
};
  
const userPool = new CognitoUserPool(poolData);

function Login() {
    const [username, setUsername] = useState('');
    const [PrefUser, setPrefUser] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [cognitoUserState, setCognitoUserState] = useState(null);
    const [Email, setEmail] = useState('');  

    const history = useNavigate();

    const handleLogin = () => {
        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password
        });

        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function () {
                console.log('Login successful!');
                history.push('/dashboard');
            },
            onFailure: function (err) {
                console.error('Login failed:', err);
            },
            newPasswordRequired: function() {
                console.log('Password change required');
                setIsChangingPassword(true);
                setCognitoUserState(cognitoUser);
            }
        });
    };

    const handlePasswordChange = () => {
        if (!cognitoUserState) {
            console.error("User session not available!");
            return;
        }

        const requiredAttributes = {
            'nickname': 'default_nickname', // Replace this default value with appropriate logic for your use case
        };

        cognitoUserState.completeNewPasswordChallenge(newPassword, requiredAttributes, {
            onSuccess: function() {
                console.log('Password changed successfully');
                setIsChangingPassword(false);
                history.push('/dashboard');
            },
            onFailure: function(err) {
                console.error('Password change failed:', err);
            }
        });
    };

    return (
        <div>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            {isChangingPassword && (
                <>
                    <input value={PrefUser} onChange={e => setPrefUser(e.target.value)} placeholder="Pref UserName" />
                    <input value={Email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" />
                    <button onClick={handlePasswordChange}>Change Password</button>
                </>
            )}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;