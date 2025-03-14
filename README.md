# restaurantmap

## Global Install Requirements

1. Install node.js on your machine https://nodejs.org/en/download

## Running Development Environment

1. Install packages using `npm`

```sh
npm install
```

2. Run the development server

```sh
npm run dev
```

3. Open the site on <http://localhost:5173> with your browser

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

### Setup for Windows Cont.

1. Use cd to get \restaurantmap\react-flask-app\api & enter VSCode command palette using `Ctrl + Shift + P` and enter `Python: Create Environment`
2. Select the python interpreter `venv/bin/python`
3. Select the testingfile.ipynb and press `Select kernal` around the top right of the screen, and select the venv as the python interpreter.
4. Run the code block with `pip install flask python-dotenv`.

### How to run (Windows)

1. Start the flask server using cd to navigate to \restaurantmap\react-flask-app\api.
2. enter VSCode command palette using `Ctrl + Shift + P` and select `Python: Select Interpreter`, setting it to the venv.
3. create a new terminal and type `flask run`.
4. cd to \restaurantmap\react-flask-app and type `yarn start`, if this works you should now have react set up and connected to your flask server!
