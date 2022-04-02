import './App.css';
import { useEffect } from 'react';

// In the following line, you should include the prefixes of implementations you want to test.
const idxDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

Object.defineProperty(window, 'indexedDB', {
	value: idxDB
});
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
const idxTrans = window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
Object.defineProperty(window, 'IDBTransaction', {
	value: idxTrans
});
const idxDBRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
Object.defineProperty(window, 'IDBKeyRange', {
	value: idxDBRange
});
const DBNAME = "MySneakers"
const DBVERSION = 5
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
function App() {

	useEffect(() => {
		const request = window.indexedDB.open(DBNAME, DBVERSION);
		request.onerror = event => {
			const { message, name } = event.target?.error ?? {}
			console.warn("Database error: ", { message, name });
			if (name === 'VersionError') {
				window.indexedDB.deleteDatabase(DBNAME)
				window.indexedDB.open(DBNAME, DBVERSION);
			}
		};

		request.onsuccess = event => {
			const db = event.target;
			console.log("success: ", db)

		};

		// only here you can change the structure of the store
		request.onupgradeneeded = event => {
			const db = event.target.result
			const currentStores = Array.from(db.objectStoreNames)
			
			const customerExists = currentStores.find(store => store === 'customers')
			if (!customerExists) {
				const objectStore = db.createObjectStore("customers", { keyPath: "fiscal_code" });
				objectStore.createIndex("name", "name", { unique: false });
				objectStore.createIndex("email", "email", { unique: false });
				console.log({ objectStore })
			}

		}

	}, [])

	return (
		<div className="App">

		</div>
	);
}

export default App;
