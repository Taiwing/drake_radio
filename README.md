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

The [Drake equation](https://en.wikipedia.org/wiki/Drake_equation) is a formula
used to estimate the number of active, communicative extraterrestrial
civilizations in the Milky Way galaxy. It was devised by Frank Drake in 1961.

The Drake equation is:

```math
N = R* * f_p * n_e * f_l * f_i * f_c * L
```

Where:

- `N` is the number of civilizations in our galaxy with which we might
    communicate.
- `R*` is the average rate of star formation in our galaxy.
- `f_p` is the fraction of those stars that have planets.
- `n_e` is the average number of planets that can potentially support life per
  star that has planets.
- `f_l` is the fraction of habitable planets on which life actually develops.
- `f_i` is the fraction of inhabited planets that develop intelligent life, thus
    civilization.
- `f_c` is the fraction of civilizations that develop a technology that releases
    detectable signs of their existence into space.
- `L` is the length of time for which such civilizations release detectable
    signals into space.

## How it works

In the settings panel, you can adjust the Drake equation parameters to see how
the number of civilizations changes. This results in two different values, `N`
and `Ny`. `Ny` is the yearly apparition rate of detectable civilizations. It is
the product of every parameter of the Drake equation except for `L`. Internally,
the application uses this value to randomly create new civilizations every year.
Multiplied by the speed simulation parameter, it gives the number of newly
created civilizations every second. Then a yearly death rate is computed based
on `Ny` and `N`. It makes the number of living civilizations oscillate around
the value of `N` and the civilizations' lifespan to be around `L`.

### Visuals

By default, a civilization birth is visually represented by a blue circle
centered around its star. It is the first signal emitted by the civilization,
its "birth signal". The circle's radius grows at the speed of light. It
represents the signal propagation in time and space. When a civilization dies a
"death signal" is emitted. It is a red circle that behaves in the same way. The
distance between the inner and outer circles represents the civilization's
lifespan.

> Since the radio signals are emitted in every direction they really are
> spheres. But for the sake of clarity and efficiency, they are represented as
> circles of the same radius. They always face the camera thus suggesting a
> sphere when the camera or galaxy moves.

When `N` is great enough, the galaxy is filled with civilizations. The resulting
number of signals can be overwhelming. To avoid this, there is a limit that can
be set in the settings panel, the birth and death signals count. It is a purely
visual setting that does not affect the Drake equation parameters or the stats
showed in the top right corner of the screen. It is a way to keep the simulation
readable and the application responsive.

The signal circles disappearance is not linked to the Drake equation parameters
either. It is purely based on the number of signals on the screen. In reality
the signals expand indefinitely.

> When the speed parameter is very high (around 100k years per second), the
> birth and death signals count should be set to 0 since the circles will
> disappear almost instantly.

By default every star is white. When at least one civilization is emitting on a
given star, it turns blue by default (same color as the birth signal). When
every civilization on a star is dead, it turns red (same color as the death
signal).

> When the speed and rate of civilizations birth are high enough, the galaxy
> will change color pretty quickly. It is a way to see the galaxy's activity at
> a glance even without the signals.

### Stats

The stats panel shows the simulation's current year and speed. It also shows the
number of living, dead and gone civilizations, as well as the total. Living
civilizations are still currently emitting signals. Dead civilizations have
stopped emitting but their signals are still visible inside the galaxy. Once the
death signal has exited the galaxy, the civilization is gone. It cannot be
detected by radio anymore. The total number of civilizations is the sum of the
living, dead and gone civilizations.

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
