var AmazonCognitoIdentity = require('amazon-cognito-auth-js');

/**
 * A CognitoAuth object using hardcoded options with success and error handlers
 */

var authData = {
	ClientId: '5l5897hr9aier4cfe9cbv6temp',
	AppWebDomain: 'syedshehzadsapp.auth.us-east-1.amazoncognito.com',
	TokenScopesArray: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
	RedirectUriSignIn: 'https://shehzadsite.s3.amazonaws.com/index.html',
	RedirectUriSignOut: 'https://shehzadsite.s3.amazonaws.com/index.html',
	// IdentityProvider : '<TODO: add identity provider you want to specify>', e.g. 'Facebook',
	UserPoolId: 'us-east-1_I1UXEGYVr', // Your user pool id here
	AdvancedSecurityDataCollectionFlag: 'true',
	Storage: localStorage
};

var auth = new AmazonCognitoIdentity.CognitoAuth(authData);

auth.userhandler = {
	onFailure: function (err) {
		alert(err);
		console.log(err);
	},
	onSuccess: function (authSession) {
		console.log(authSession);
	}
};

module.exports = auth;