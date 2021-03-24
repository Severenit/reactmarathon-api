export class PubSubManager {
  constructor() {
    this.channels = {
      test: {
        message: '',
        subscribers: [],
      },
    };
    this.brokerId = setInterval(() => {
      this.broker();
    }, 1000);
  }

  createChannel(symbol) {
    this.channels[symbol] = {
      message: '',
      subscribers: [],
    };
  }

	deleteChannel(symbol) {
		delete this.channel[symbol];
	}

  subscribe(subscriber, channel) {
    console.log(`subscribing to ${channel}`);
    this.channels[channel].subscribers.push(subscriber);
  }

	unsubscribe(subscriber, channel) {
		const newSubs = this.channels[channel].subscribers.filter(sub => sub.id === subscriber.id);
		this.channels[channel].subscribers = newSubs;
	}

  removeBroker() {
    clearInterval(this.brokerId);
  }

  publish(publisher, channel, message) {
    this.channels[channel].message = message;
  }

  broker() {
    for (const channel in this.channels) {
      if (this.channels.hasOwnProperty(channel)) {
        const channelObj = this.channels[channel];
        if (channelObj.message) {
          console.log(`found message: ${channelObj.message} in ${channel}`);

          channelObj.subscribers.forEach((subscriber) => {
            subscriber.send(
              JSON.stringify({
                message: channelObj.message,
              })
            );
          });

          channelObj.message = '';
        }
      }
    }
  }
}
