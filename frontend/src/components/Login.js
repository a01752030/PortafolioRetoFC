import React, { useState } from 'react';
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
      const [nickname, setNickname] = useState('');  
      const [Email,setEmail] = useState('');  
  
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
                  // Handle successful login
              },
              onFailure: function (err) {
                  console.error('Login failed:', err);
                  // Handle failed login
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
            'nickname': nickname  // Add all other required attributes similarly
        //    'preferred_username' : PrefUser,
        //    'Email' : Email
        };

        cognitoUserState.completeNewPasswordChallenge(newPassword, requiredAttributes, {
            onSuccess: function() {
                console.log('Password changed successfully');
                setIsChangingPassword(false);
                // Maybe redirect the user to the dashboard or some other page
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
                    {/* <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Nickname" /> {/* Input for nickname */}*/}
                    <input value={PrefUser} onChange={e => setPrefUser(e.target.value)} placeholder="Pref UserName" /> {/* Input for PrefUser */}
                    <input value={Email} onChange={e => setEmail(e.target.value)} placeholder="Email" /> {/* Input for PrefUser */}
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" />
                    <button onClick={handlePasswordChange}>Change Password</button>
                </>
            )}
              <button onClick={handleLogin}>Login</button>
          </div>
      );
  }
  
  export default Login;