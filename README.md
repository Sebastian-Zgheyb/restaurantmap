# restaurantmap

## Global Install Requirements

1. Install node.js on your machine https://nodejs.org/en/download

## Running Development Environment Vite

1. Install packages using `npm`

```sh
npm install
```

2. Run the development server

```sh
npm run dev
```

3. Open the site on <http://localhost:5173> with your browser

## Running Development Environment Flask

1. Create a new terminal & re-enter the Virtual Python Environment (.venv)

2. Navigate to resaurantmap\src\api

```sh
cd .\src\api
```

3. Run the flask server

```sh
flask run
```

## Running Python Virtual Environment

### WSL/Shell

1. In the repositories working directory, create the python virtual environment

```sh
python3 -m venv .venv
```

2. Enter the python virtual environment

```sh
source .venv/bin/activate
```

3. Install the python dependencies

```sh
pip install -r requirements.txt
```

To exit the python environment, run the `deactivate` command. If you want to re-enter the virtual environment, run the `source .venv/bin/activate` command again.

### VSCode

1. In the VSCode command palette, enter VSCode command palette using `Ctrl + Shift + P` and enter `Python: Create Environment`

2. Select the python interpreter `venv/bin/python`

3. Select the `requirements.txt` file and click `Ok`

To re-enter the virtual environment, run the `Python: Select Interpreter` command.