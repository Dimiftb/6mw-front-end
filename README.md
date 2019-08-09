Built with Ionic and NodeJS

See Scott Morrison's project report for installation instructions and for overview of code.

----

Ionic ReadMe


Building and Running the Ionic Application
Prerequisites
Install NodeJS and npm (npm comes with NodeJS install):
https://nodejs.org/en/ 

Verify install by running:
npm –version
node --version

To ensure you have the latest version of npm run:
npm install npm@latest -g

Install Ionic and Cordova:
npm install -g ionic cordova
note: -g signifies a global install therefore administrative rights are required

Building node_modules folder & Ionic plugins
All required node_modules are listed in the project’s package.json file. These need to be downloaded and generated in a node_modules folder within the project before continuing.
To do this run the following command from the project directory (where package.json resides):
npm install
This may take some time depending on your connection speed.

After creating the new node_modules folder, the Ionic platform and plugins need to be restored from package.json. From the project directory run:
ionic cordova prepare

Running Ionic application
On success of all the above, you can now run the Ionic application. To run the application such that it appears in the browser run (from the project directory):
ionic serve

This will boot a development server and run the application in your browser. However, due to the application using Cordova, some plugins won’t function as expected and a ‘Cordova not available error’ will be thrown, namely when clicking the ‘Start Timer’ button. Therefore, to get around this it is recommended to run the application using an emulator by running the following command: 
Ionic cordova run [<platform>]
Where [<platform>] would be android/ios.

Stopping Ionic application
Stopping the Ionic serve command can be done by going to the terminal and entering: 
Ctrl+c

Testing on a native device
There are a number of ways to test the Ionic application in a native environment. For instructions please follow the Ionic documentation:
To create either a debug or production apk or ipa file for Android or iOS follow:
https://ionicframework.com/docs/cli/cordova/build/

To run the application on a connected native device, follow:
https://ionicframework.com/docs/cli/cordova/run/

To run the application on an emulator, follow:
https://ionicframework.com/docs/cli/cordova/emulate/

Note: for emulating the application, your environment must be setup correctly. To ensure this is the case please follow:
Android: https://cordova.apache.org/docs/en/latest/guide/platforms/android/#installing-the-requirements
iOS: https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html


