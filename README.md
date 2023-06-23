
# SpeakEasy

The SpeakEasy web service is a new and innovative solution for internet navigation that utilizes the power of speech recognition technology. The service is designed to improve accessibility and efficiency for individuals who may have difficulty navigating the internet through traditional methods. SpeakEasy uses the Google Speech-to-Text (STT) API for speech recognition and natural language processing, and a custom-built command execution module to perform actions on the targeted website. The service is optimized for using on mobile devices, making it a convenient and user-friendly tool for internet navigation.

# Technologies

Node.js: SpeakEasy utilizes Node.js as the server-side runtime environment. 
Ensure that the appropriate version of Node.js is installed on the target system. Instructions for installing Node.js can be found on the official Node.js website (https://nodejs.org).

Database System: SpeakEasy relies on an SQLite database to store configuration data and user information. The SQLite database engine is included with the system and does not require any additional installation steps.

# Getting Started

In order to run the project you must have a google cloud Speech-to-Text API account.
Because the json stt needs to be configured in the speakeasy project to use the google model.
(The service is free for a limited time, then paid, so we removed our key which was configured).

Extract the contents of the package to a directory of your choice.

Open a command prompt or terminal and navigate to the extracted directory.

For login page:

	0. We need to provide more 5 files that secret and can't in public mode in git, so contact us: misha717@gmail.com

	1.  run commnands:
	        cd new_page_login
            npm install
		    node server.js
		    cd ../
		
	2. Open in browser: "localhost:3000" and sign up, after back to home and login
	
	3. In login page: generate an api-key and upload your commands.txt, and save the api-key in notes
	
	4. Use the help button for see where need to provide the api-key

For website page:

	5. Open wm_mobile/index.js and insert the api-key in app.post('/stt', async (req, res)) function (in api_key variable)
	
	6. run commands:
		cd wm1
        npm install
		npm run dev
		cd ../
		cd wm_mobile
		npm install
		npm run dev

		cd ../
		cd webservice
		npm install
		npm run dev
		cd ../

	7. Open in browser: "localhost:7000" and login, and use in up right side setting and push "עוזר קולי", enjoy!


