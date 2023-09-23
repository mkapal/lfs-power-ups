# Carmageddon / Re-Volt inspired InSim

Lap or time based races with power-ups.  The goal is to score the most points and finish the race.

## Pick-ups / power-ups

Pick-ups are special autocross objects spawned at random places on track. They can be distinguished by a colour.

If you drive over them, one of the following random features gets activated:

* A heavy object is spawned behind the car to obstruct the cars behind
* Must stop the car in a time limit before going again to get bonus points
* Must not go below certain speed to get extra points
* Must not hit anyone in the next X seconds to get bonus points
* Instant car reset (stop) + repair
* Spawn a clone fake power-up
* Random points bonus
* Health bonus
* Lucky dog (get a lap back if one or more laps behind)
* Inatke restriction for X seconds
* Mass handicap for X seconds
* Cars within a certain distance behind will gain points for X seconds

# Car health

* Car health is based on contacts with other cars or walls. You lose health by crashing into other cars or objects / walls. You can gain health by driving over a pick-up object with health bonus.
* Quick repair zones
* If you stop in that zone, you get instant car repair + full health.
* Sections of track guarded by start lights
* when the lights go red, you lose points when driving through it
* when the lights go green, you gain points when driving through it
* Sections of track with maximum speed
* if going over that speed, you lose points.

## Bonus points

* Finishing position
* Top speed
* Fastest lap
* Highest climber
* Stunt bonus (jumps, flips etc.)

## Development

### Requirements

- Node.js v18
- pnpm
- LFS

### Installation

```shell
pnpm install
```

### Development build

```shell
pnpm dev
```

The app connects to `127.0.0.1:29999` by default.

### Production build

```shell
pnpm build
pnpm serve:production
```
