Test Data Contracts:

## bad latitude
curl -v -X PUT http://localhost:8080/geoapp/sensor/createEvent --json @- <<EOF
{
    "sensorType": "lgds",
    "eventType": "LGDS-TEST",    
    "latitude": -100.33411,
    "longitude": -109.95507,
    "severity": "HIGH"
}
EOF

## good lat-lon
curl -v -X PUT http://localhost:8080/geoapp/sensor/createEvent --json @- <<EOF
{
    "sensorType": "rvss",
    "eventType": "RVSS-TEST",    
    "latitude": 31.33411,
    "longitude": -109.95516,
    "severity": "HIGH"
}
EOF