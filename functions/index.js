const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

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
