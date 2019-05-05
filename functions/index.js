const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

var request = require('request');

// this function creates a document when an user has been created
// this allow us to take control of the user in firestore
exports.create_user_document = functions.auth.user().onCreate((user, context) => {
	if (user.uid) {

		//user document
		const u_doc = '/users/' + user.uid

		console.log('[Create user document] Function has been called by ' + user.uid)

		console.log('[Create user document] Accessing to:', u_doc)
		const docRef = db.collection('users').doc(user.uid)

		console.log('[Create user document] Setting information up in the document:', u_doc)

		const default_data = {
			uid: user.uid,
		}

		const setInfo = docRef.set(default_data)

		return setInfo.catch((error) => {
			console.error(
				'[Create user document] There was an error at trying to create the document',
				u_doc,
				'\nWith error:', error
			)
		})
	} else {
		console.error('[Create user document] Invalid user id', user.uid)
		return false
	}

})

// this deletes document asociated with the user when the user has been deleted
exports.delete_user_document = functions.auth.user().onDelete((user, context) => {
	if (user.uid) {

		//user document
		const u_doc = '/users/' + user.uid

		console.log('[Delete user document] function has been called by', user.uid)

		console.log('[Delete user document] Accessing to document', u_doc)
		const docRef = db.collection('users').doc(user.uid)

		console.log('[Delete user document] Deleting document', u_doc)
		const deleteResult = docRef.delete()

		return deleteResult.catch(error => {
			console.error(
				'[Delete user document] There was a problem at trying to eliminate the document',
				u_doc,
				'\nWith error:', error
			)
		})

	} else {
		console.error('[Delete user document] Invalid user id', user.uid)
		return false
	}
})

// this function allows to define a type of a entity
// PERSON and TROUPE could be the possible values
exports.define_type = functions.https.onCall((data, context) => {

	const type_user = data.type;

	// Authentication / user information is automatically added to the request.
	const uid = context.auth.uid;

	console.log('[Define type] Function has been called by', uid);

	if (uid) {
		//user document
		const u_doc = '/users/' + uid;

		console.log('[Define type] Accessing to document', u_doc);
		const docRef = db.collection('users').doc(uid);

		console.log('[Define type] Updating document', u_doc, 'in field type with:', type_user);

		return docRef.update({
			type: type_user
		}).catch(error => {
			console.error(
				'[Define type] There was a problem at trying to update the document',
				u_doc,
				'\nWith error:', error
			)
		});

	} else {
		console.error('[Define type] Invalid user id', user.uid);
		return false;
	}


})

// this function allows to generate a token and it returns it
exports.generate_token = functions.https.onCall((data, context) => {

	console.log('[generate_token] Function has been called');

	var token;

	return new Promise((resolve, reject) => {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				'x-api-key': '619Ba31E201Cf85bb60EBBD2cE6aF6700C9f471D8155f52EebDc7eE9'
			},
			url: 'https://achtin-dev.minka.io/oauth/token',
			body: "client_id=12cbd94AeA1Bc1dce13Fc4bb0Ad14fEb&secret=82cF3dCDdEEC9f2cD097E7d2cd2DfdFE81F57C5eaCdfF2aF&grant_type=client_credentials"
		}, (error, response, body) => {

			console.log('[generate_token] Post request done')
			token = JSON.parse(body);

			if (error) {
				console.error('[generate_token] ERROR:', error);
				reject(error);
			} else {
				console.log('Access token:', token.access_token);
				resolve(token.access_token);
			}
		});

	});


})