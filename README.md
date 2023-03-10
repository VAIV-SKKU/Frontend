
# Short-term Stock Prediction Simulator - Frontend

> A simulator that can predict the possible outcomes of inidividual stocks in KOSPI/KOSDAQ

## Simulator Image

### 1. Today's Discovery
Recommends potential raising stocks for the day based on the probability outcomes of CNN/YOLO.
![image](https://user-images.githubusercontent.com/68769481/209825811-df515f0e-57eb-43f5-a73c-bafca8b75e95.png)


<br />

### 2. My Asset
Stores the stocks picked by the user.

![image](https://user-images.githubusercontent.com/68769481/209825905-a9ac34de-f23b-41d9-8a2b-04db658527d7.png)


<br />

### 3. Backtesting
Calculates the profits of previous dates
![image](https://user-images.githubusercontent.com/68769481/209825890-6f2da53f-21ba-461f-a195-54368ae737f6.png)




<br />


<br />

## Getting Started

### Clone Repository

```shell script
$ https://github.com/VAIV-SKKU/Frontend.git

```

### How to Run

```

python demo.py

```
## 파일 구조

```
.
├── README.md
├── static
│   ├── images
│   ├── today_results
│   ├── NavergetOHLC.js
│   ├── KRXgetOHLC.js
│   ├── icons.css
│   ├── loadingoverlay.min.js
│   └── login.css
|   └── login.js
|   └── main.css
|   └── main.css
|   └── package.json
|   └── main.css
|   └── stock.js
|   └── stock.css
|   └── tab.js
|
└── templates
    ├── home.html
    ├── login.html
    ├── simulate.html
    ├── test.html
    ├── upload.html
    ├── yot.html

```

<br />

## Components

- **[NavergetOHLC.js](https://github.com/skku-synapse/frontend/blob/main/src/components/Test.js)**
  - Creates the stock charts shown in the simulation using Naver Finance.

- **[KRXgetOHLC.js](https://github.com/VAIV-SKKU/Frontend/blob/main/static/KRXgetOHLC.js)**
  - Creates the stock charts shown in the simulation using data.krx
  
- **[stock.js](https://github.com/VAIV-SKKU/Frontend/blob/main/static/stock.js)**
  - The main JavaScript file for the simulator. Implements all of the dynamic actions that happen on the page.

- **[login.js](https://github.com/VAIV-SKKU/Frontend/blob/main/static/login.js)**
  - The login page JavaScript file for the simulator. If you click the login button on the main page, a login pop-up page appears.
