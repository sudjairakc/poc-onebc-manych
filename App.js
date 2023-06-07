/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState, useMemo, forwardRef} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {LiveStreamView} from '@api.video/react-native-livestream';
import IVSPlayer from 'amazon-ivs-react-native-player';

export default function App() {
  console.log('LIVE SHOW');
  const itemRefs = useRef([]);
  const [initLives, setInitLives] = useState([
    {
      id: 1,
      streaming: false,
      isLive: false,
      paused: false,
      server: 'rtmps://ca1b6d02cf3e.global-contribute.live-video.net:443/app/',
      key: 'sk_us-east-1_vXog6Hx8gfoF_JJazAZS2ifjQ73TbpGDlNCdYZjQ1y4',
      url: 'https://ca1b6d02cf3e.us-east-1.playback.live-video.net/api/video/v1/us-east-1.925004593851.channel.8OH4GA4G55Fy.m3u8',
    },
    {
      id: 2,
      streaming: false,
      isLive: false,
      paused: false,
      server: 'rtmps://ca1b6d02cf3e.global-contribute.live-video.net:443/app/',
      key: 'sk_us-east-1_vXog6Hx8gfoF_JJazAZS2ifjQ73TbpGDlNCdYZjQ1y4',
      url: 'https://ca1b6d02cf3e.us-east-1.playback.live-video.net/api/video/v1/us-east-1.925004593851.channel.8OH4GA4G55Fy.m3u8',
    },
    {
      id: 3,
      streaming: false,
      isLive: false,
      paused: false,
      server: 'rtmps://ca1b6d02cf3e.global-contribute.live-video.net:443/app/',
      key: 'sk_us-east-1_vXog6Hx8gfoF_JJazAZS2ifjQ73TbpGDlNCdYZjQ1y4',
      url: 'https://ca1b6d02cf3e.us-east-1.playback.live-video.net/api/video/v1/us-east-1.925004593851.channel.8OH4GA4G55Fy.m3u8',
    },
  ]);

  const setLive = ({index, bool}) => {
    let initLivesTemp = [...initLives];
    initLivesTemp = initLivesTemp.map((i, idx) => {
      if (idx === index) {
        i.isLive = bool;
      }
    });

    setInitLives(initLivesTemp);
  };

  const setStreaming = ({index, bool}) => {
    let initLivesTemp = [...initLives];
    initLivesTemp = initLivesTemp.map((i, idx) => {
      if (idx === index) {
        i.streaming = bool;
      }
    });

    setInitLives(initLivesTemp);
  };

  const togglePause = ({index}) => {
    let initLivesTemp = [...initLives];
    initLivesTemp = initLivesTemp.map((i, idx) => {
      if (idx === index) {
        i.paused = !i.paused;
      }
    });

    setInitLives(initLivesTemp);
  };

  const ItemSeparatorComp = <View style={styles.separator} />;

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.title}>LIVE SHOW</Text>
      </View>
      <FlatList
        data={initLives}
        renderItem={({item, index}) => (
          <View style={styles.container}>
            <View style={styles.player}>
              <LiveStream
                index={index}
                ref={ref => (itemRefs.current[index] = ref)}
                liveKey={
                  item.key ??
                  'sk_us-east-1_vXog6Hx8gfoF_JJazAZS2ifjQ73TbpGDlNCdYZjQ1y4'
                }
                server={
                  item.server ??
                  'rtmps://ca1b6d02cf3e.global-contribute.live-video.net:443/app/'
                }
                streaming={item.streaming}
                setStreaming={setStreaming}
                setLive={setLive}
              />
            </View>
            <View style={styles.player}>
              {item.isLive && (
                <Player
                  {...{
                    index: index,
                    paused: item.paused,
                    streamUrl: item.url,
                    togglePause,
                  }}
                />
              )}
            </View>
          </View>
        )}
        ItemSeparatorComponent={ItemSeparatorComp}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const Player = ({index, paused, streamUrl, togglePause}) => {
  console.log('sream url: ', streamUrl, index);
  return useMemo(
    () => (
      <IVSPlayer
        autoplay
        paused={Boolean(paused)}
        streamUrl={streamUrl}
        onSeek={newPosition => {
          console.log('new position', newPosition);
        }}
        onPlayerStateChange={state => {
          console.log(`state changed: ${state}`); // e.g. PlayerState.Playing
        }}
        onDurationChange={duration => {
          console.log(`duration changed: ${duration}`); // in miliseconds
        }}
        onQualityChange={newQuality => {
          console.log(`quality changed: ${newQuality?.name}`);
        }}
        onRebuffering={() => {
          console.log('rebuffering...');
        }}
        onLoadStart={() => {
          console.log('load started');
        }}
        onLoad={loadedDuration => {
          console.log(`loaded duration changed: ${loadedDuration}`); // in miliseconds
        }}
        onLiveLatencyChange={liveLatency =>
          console.log(`live latency changed: ${liveLatency}`)
        }
        onTextCue={textCue => {
          console.log('text cue type', textCue.type);
          console.log('text cue size', textCue.size);
          console.log('text cue text', textCue.text);
          // type, line, size, position, text, textAlignment
        }}
        onTextMetadataCue={
          textMetadataCue =>
            console.log('text metadata cue text', textMetadataCue.text)
          // type, text, textDescription
        }
        onProgress={position => {
          console.log(
            `progress changed: ${position}`, // in miliseconds
          );
        }}
        onData={data => {
          console.log(`data: ${data.version}`);
          // qualities, version, sessionId
          console.log(`data: ${data.qualities[0].width}`);
          // name, codecs, bitrate, framerate, width, height
        }}
        onVideoStatistics={video => {
          console.log('video bitrate', video.bitrate);
          // bitrate, duration, framesDecoded, framesDropped
        }}
        onError={error => {
          console.log('error', error);
        }}
        onTimePoint={timePoint => {
          console.log('time point', timePoint);
        }}>
        <View style={styles.paused}>
          <TouchableOpacity onPress={() => togglePause({index})}>
            <Text styles={styles.button}>{paused ? 'play' : 'pause'}</Text>
          </TouchableOpacity>
        </View>
      </IVSPlayer>
    ),
    [index, paused, streamUrl, togglePause],
  );
};

const LiveStream = forwardRef(
  ({index, liveKey, server, streaming, setStreaming, setLive}, ref) => {
    console.log('key and ref: ', liveKey, ref);
    return useMemo(
      () => (
        <View style={styles.playerStyle.container}>
          <LiveStreamView
            style={styles.playerStyle.body}
            ref={ref}
            camera="front"
            video={{
              fps: 30,
              resolution: '1080p',
              bitrate: 2500,
            }}
            audio={{
              bitrate: 128000,
              sampleRate: 44100,
              isStereo: true,
            }}
            isMuted={false}
            onConnectionSuccess={() => {
              console.log('successfully connected.');
              setTimeout(() => setLive({index, bool: true}), 5000);
              //do what you want
            }}
            onConnectionFailed={e => {
              console.log('connect fail.');
              //do what you want
            }}
            onDisconnect={() => {
              console.log('successfully disconnected.', index);
              setLive({index, bool: false});
              //do what you want
            }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={streaming ? styles.buttonPlay : styles.buttonPause}
              onPress={() => {
                if (streaming) {
                  ref.current?.stopStreaming();
                  setStreaming({index, bool: false});
                } else {
                  ref.current?.startStreaming(liveKey, server);
                  setStreaming({index, bool: true});
                }
              }}
            />
          </View>
        </View>
      ),
      [index, liveKey, server, ref, streaming, setStreaming, setLive],
    );
  },
);

const styles = StyleSheet.create({
  separator: {backgroundColor: '#f0f0f0', height: 2},
  header: {
    borderWidth: 5,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 20,
    height: 100,
    marginBottom: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  container: {
    flex: 1,
    height: 400,
    borderWidth: 25,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  player: {
    flex: 1,
    height: 200,
    width: '100%',
    backgroundColor: 'grey',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  paused: {
    alignSelf: 'flex-end',
  },
  button: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  playerStyle: {
    container: {
      height: '100%',
      alignItems: 'center',
    },
    body: {flex: 1, backgroundColor: 'black', alignSelf: 'stretch'},
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
    },
    buttonPlay: {
      borderRadius: 50,
      backgroundColor: 'red',
      width: 50,
      height: 50,
    },
    buttonPause: {
      borderRadius: 50,
      backgroundColor: 'white',
      width: 50,
      height: 50,
    },
  },
});
