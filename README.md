# Drake Radio Simulator

Galactic simulation representing the Drake equation.

<br />
<p align="center">
	<img src="https://github.com/Taiwing/drake_radio/blob/master/resources/screenshot.png?raw=true" alt="Drake-Radio app screenshot" style="width: 50%;" />
</p>

## Description

This is an interactive and visual representation of the Drake equation. It shows
how extraterrestrial radio signals could travel across the galaxy depending on
the equation parameters.

https://drake-radio.defoy.tech

## Setup

### Run the application

```shell
# clone it
git clone https://github.com/Taiwing/drake_radio
cd drake_radio/
```

The first thing you need to do is to create an environment file for the
application. To use the default values you can simply copy the _env.sample_ file
at the root of the repository and rename it to _.env_:

```shell
cp env.sample .env
```

Then you can run the application:

```
docker compose up -d
```

Click [here](http://localhost:8080) to test it locally.
