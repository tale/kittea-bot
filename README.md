# Kittea Cafe Chat Bot
The Kittea Cafe guild chat to discord bot.<br/>
This bot is capable of acting as a bridge between

I do not recommend that you attempt to deploy this project yourself. It has a very specific use <br/>
This project is deployed using Kubernetes, so apply the following secret before applying the manifest at `deploy.yaml`.
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: kittea-bot-credentials
type: Opaque
stringData:
    MC_EMAIL: 'account_email'
    MC_PASSWORD: 'account_password'
    DISCORD_TOKEN: 'bot_token'
    DISCORD_CHAT_CHANNEL: 'chat_channel_id'
    DISCORD_NOTIFY_CHANNEL: 'notify_channel_id'
```

### Development
This project works best in Docker and relies on [`Taskfile`](https://taskfile.dev/)<br/>.

Ubuntu: `sudo snap install task --classic`
macOS: `brew install go-task/tap/go-task`
