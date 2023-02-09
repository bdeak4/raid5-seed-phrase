# raid5-seed-phrase

Protect your crypto seed phrase with the power of RAID5

## CLI

```
./cli.js [stripe|rebuild] [arguments] < [dataFile]
```

### Example

Stripe seed phrase in 4 blocks:

```
./cli.js stripe 4 < seed.txt
```

Rebuild seed phrase from N-1 blocks:

```
./cli.js rebuild < blocks.txt
```

## GUI

todo