class PubSubManager {
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
    this.channel[symbol] = {
      message: '',
      subscribers: [],
    };
  }

  subscribe(subscriber, channel) {
    console.log(`subscribing to ${channel}`);
    this.channels[channel].subscribers.push(subscriber);
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
module.exports = PubSubManager;
