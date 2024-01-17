# browser_extension_db
Eine Browser-Erweiterung für den DB-Navigator.


### 1. Idee / Ziel
Diese Erweiterung soll dem Nutzer die Möglichkeit geben, 

1. die Züge der gewünschten Route anhdand von Start- und Endpunkten anzeigen zu lassen
2. alle Züge ab einer gewünschten Haltestelle anzeigen zu lassen

Dabei soll es dem Nutzer überlassen werden, welche der Funktionen er benutzt, da diese unabhängig voneinander funktionieren.<br><br>

### 2. Verwendete Technologie
Für die Realisierung des Projektes wurde die [v6.db.transport.rest](https://v6.db.transport.rest/getting-started.html) - Schnittstelle genutzt.

Die API nutzt eine JavaScript - Abfrage, die somit in eine Grafische Oberfläche eingearbeitet werden konnte. Im folgenden ist ein Beispiel zu sehen
``` js
curl 'https://v6.db.transport.rest/journeys?from=8011113&to=8010159&departure=tomorrow+2pm&results=2' -s | jq
```

<details>
  <summary>Ergebnis</summary>
  
  ``` js
  {
	"journeys": [{
		// 1st journey
		"type": "journey",
		"legs": [{
			// 1st leg
			"tripId": "1|310315|0|80|2052020",
			"direction": "München Hbf",
			"line": {
				"type": "line",
				"id": "ice-1601",
				"name": "ICE 1601",
				"mode": "train",
				"product": "nationalExpress",
				// …
			},

			"origin": {
				"type": "stop",
				"id": "8011113",
				"name": "Berlin Südkreuz",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"departure": "2020-05-02T14:37:00+02:00",
			"plannedDeparture": "2020-05-02T14:37:00+02:00",
			"departureDelay": null,
			"departurePlatform": "3",
			"plannedDeparturePlatform": "3"

			"destination": {
				"type": "stop",
				"id": "8010205",
				"name": "Leipzig Hbf",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"arrival": "2020-05-02T15:42:00+02:00",
			"plannedArrival": "2020-05-02T15:42:00+02:00",
			"arrivalDelay": null,
			"arrivalPlatform": "11",
			"plannedArrivalPlatform": "11",
			// …
		}, {
			// 2nd leg
			"walking": true,
			"distance": 116,

			"origin": {
				"type": "stop",
				"id": "8010205",
				"name": "Leipzig Hbf",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"departure": "2020-05-02T15:42:00+02:00",
			"plannedDeparture": "2020-05-02T15:42:00+02:00",
			"departureDelay": null,

			"destination": {
				"type": "stop",
				"id": "8098205",
				"name": "Leipzig Hbf (tief)",
				"location": { /* … */ },
				"products": { /* … */ },,
				"station": {
					"type": "station",
					"id": "8010205",
					"name": "Leipzig Hbf",
					"location": { /* … */ },
					"products": { /* … */ },
				}
			},
			"arrival": "2020-05-02T15:51:00+02:00",
			"plannedArrival": "2020-05-02T15:51:00+02:00",
			"arrivalDelay": null,
			// …
		}, {
			// 3rd leg
			"tripId": "1|334376|4|80|2052020",
			"direction": "Halle(Saale)Hbf",
			"line": {
				"type": "line",
				"id": "4-800486-5",
				"name": "S 5",
				"mode": "train",
				"product": "suburban",
				// …
			},

			"origin": {
				"type": "stop",
				"id": "8098205",
				"name": "Leipzig Hbf (tief)",
				"location": { /* … */ },
				"products": { /* … */ },,
				"station": {
					"type": "station",
					"id": "8010205",
					"name": "Leipzig Hbf",
					"location": { /* … */ },
					"products": { /* … */ },
				}
			},
			"departure": "2020-05-02T15:53:00+02:00",
			"plannedDeparture": "2020-05-02T15:53:00+02:00",
			"departureDelay": null,
			"departurePlatform": "2",
			"plannedDeparturePlatform": "2",

			"destination": {
				"type": "stop",
				"id": "8010159",
				"name": "Halle(Saale)Hbf",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"arrival": "2020-05-02T16:19:00+02:00",
			"plannedArrival": "2020-05-02T16:19:00+02:00",
			"arrivalDelay": null,
			"arrivalPlatform": "13",
			"plannedArrivalPlatform": "13",

			"cycle": {"min": 600, "max": 1800, "nr": 7},
			"alternatives": [
				{
					"tripId": "1|333647|0|80|2052020",
					"direction": "Halle(Saale)Hbf",
					"line": { /* … */ },
					"when": "2020-05-02T16:03:00+02:00",
					"plannedWhen": "2020-05-02T16:03:00+02:00",
					"delay": null,
				},
				// …
			],
			// …
		}],
	}, {
		// 2nd journey
		"type": "journey",
		"legs": [ /* … */ ],
		// …
	}],

	// …
}

  ```
</details>

Hier wurden die Stationen 8011113 (Berlin Südkreuz) zu 8010159 (Halle (Saale)Hbf), startend morgen um 14:00 Uhr, gefetcht.<br><br>  



### 3. Installation
Um Diese Anwendung für den privaten Zweck verwenden zu können muss man folgende Schritte erledigen: 
1. zunächst muss das [Repository](https://github.com/ibozorus/browser_extension_db/tree/main) lokal installiert werden.
2. nun muss man in der Kommandozeile zu dem Ordner navigieren, indem sich die lokale Kopie befindet.
3. jetzt noch ```npm install``` eingeben und der Ordner kann in Chrome importiert werden.

Um die Anwendung final im Browser (Chrome) zu sehen, ist folgende [Anleitung](https://support.google.com/chrome_webstore/answer/2664769?hl=en) gegeben.
