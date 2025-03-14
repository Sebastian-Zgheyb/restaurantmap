# restaurantmap

## For Development

### WSL/Shell

1. In the repositories working directory, create the python virtual environment

```shell
python3 -m venv .venv
```

2. Enter the python virtual environment

```shell
source .venv/bin/activate
```

3. Install the python dependencies

```shell
pip install -r requirements.txt
```

To exit the python environment, run the `deactivate` command. If you want to re-enter the virtual environment, run the `source .venv/bin/activate` command again.

### VSCode

1. In the VSCode command palette, enter VSCode command palette using `Ctrl + Shift + P` and enter `Python: Create Environment`

2. Select the python interpreter `venv/bin/python`

3. Select the `requirements.txt` file and click `Ok`

To re-enter the virtual environment, run the `Python: Select Interpreter` command.

