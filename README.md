# SAP-S4-EM
Node application to connect sap s4haha to SAP scp EM service
This applicaiton takes the sap service entry sheet data via SAP open api and send it to sap enterprise messaging service in SCP.

I used enterprise messaging rest endpoints to send the data.
This is based on simple express js framework and request module.

i created a mock server using express js and create routes '/service-sheet' which actually using sap VDM for service entry sheet 
to feth the data form s4hana system. This mock server actually works as a middleman as we need a service to call sap odata API.

Now after getting data form the backend system in the call back of app.get er are calling all the api endpoints to send the data to EM.

