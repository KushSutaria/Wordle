import { CognitoUserPool } from "amazon-cognito-identity-js";


const poolData = {
    UserPoolId: 'us-east-1_wBcT0aSGQ',
    ClientId: '3acb3rqhrl1l834jma43337uht'
};

export default new CognitoUserPool(poolData);