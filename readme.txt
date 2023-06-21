For login page:

	0. We need to provide more 5 files that secret and can't in public mode in git, so contact us: misha717@gmail.com

	1.  run commnands:
		npm install
	               cd new_page_login
		node server.js
		cd ../
		
	2. Open in browser: "localhost:3000" and sign up, after back to home and login
	
	3. In login page: generate an api-key and upload your commands.txt, and save the api-key in notes
	
	4. Use the help button for see where need to provide the api-key

For website page:

	5. Open wm_mobile/index.js and insert the api-key in app.post('/stt', async (req, res)) function (in api_key variable)
	
	6. run commands:
		npm install
		cd wm1
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
	
