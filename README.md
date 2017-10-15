# Naboo-Course-Marketplace

The plattform-prototype for creative and talented people!

# Quick Setup

MongoDB Setup (verwendete Version 3.2):

Schritt 1: Installation https://www.mongodb.com/de <br>
•	Standard-Pfad: C:\ProgramFiles\MongoDB\Server\3.2\. <br>
Schritt 2: Data-Directory erstellen <br>
•	Command Prompt öffnen und md \data\db ausführen <br>
Schritt 3: MongoDB starten <br>
•	cd C:\ProgramFiles\MongoDB\Server\3.2\bin\mongod.exe <br>
Das Setup ist unter folgendem Link nochmal genauer beschrieben:  https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/ <br>

NodeJS Setup (verwendete Version 7.5.0)

Schritt 1: Installation  https://nodejs.org/de/download/ <br>
•	Nach der Installation Versionskontrolle durchführen: node –v & npm –v <br>
Das Setup ist unter folgendem Link nochmal genauer beschrieben: http://blog.teamtreehouse.com/install-node-js-npm-windows <br>

Naboo Setup

Schritt 1: Klonen der Github-Repository  <br>
$ git clone https://github.com/DiMartino89/naboo-course-marketplace.git <br>
Schritt 2: Concurrently-Modul für Anwendungs-Start im root-Verzeichnis installieren <br>
•	$ npm install concurrently <br>
Schritt 3: Anwendung aus dem root-Verzeichnis starten <br>
$ npm start 
