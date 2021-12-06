# kittea-bot
The Kittea Cafe guild chat to discord bot.

To deploy, apply the following secret before applying the manifest at `deploy.yaml`.
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
    DISCORD_CHANNEL: 'chat_channel_id'
