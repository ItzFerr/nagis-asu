const { MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const { MessageEmbed, Message } = require('discord.js');

class dropdownroles {
  constructor() {
    this.roles = [];
    return this;
  }

  /**
   *
   * @param {String} label - dropdown label
   * @param {String} emoji - The emoji id [optional]
   * @param {String} role - The role id
   */
  addrole({ label, emoji, role }) {
    if (!label) throw new Error('please provide the button label!');
    if (!emoji) emoji = null;
    if (!role) throw new Error('please provide a role!');
    this.roles.push({ label: label, emoji: emoji, role: role });
    return this;
  }

  toJSON() {
    return { roles: this.roles };
  }

  /**
   *
   * @param {Message} message - The Discord Message
   * @param {String} content - The Discord send data, can be an embed or string
   * @param {String} role - The role ID of the role
   * @param {String} channelID - The channel ID that will be receiving the dropdown
   */
  static async create({ message, content, role, channelID }) {
    if (!(message instanceof Message)) throw new TypeError('please provide the Discord Message');
    if (!content) throw new Error('please provide content!');
    if (!role) throw new Error('role not provided!');
    if (!channelID) throw new Error('channelID not provided!');

    const dropdownOptions = [];
    for (const roleObject of role.roles) {
      dropdownOptions.push(
        new MessageMenuOption()
          .setLabel(roleObject.label)
          .setEmoji(roleObject.emoji)
          .setValue(roleObject.role)
      );
    }

    const dropdown = new MessageMenu()
      .addOptions(dropdownOptions)
      .setID('dropdown-roles')
      .setPlaceholder('Klik menu ini untuk memilih role.')
      .setMinValues(0) // Allow no selection
      .setMaxValues(dropdownOptions.length); // Set maximum values that can be selected

    const row = new MessageActionRow().addComponent(dropdown);

    if (content instanceof MessageEmbed) {
      await message.client.channels.cache.get(channelID).send({ embed: content, components: [row] });
    } else {
      await message.client.channels.cache.get(channelID).send(content, { components: [row] });
    }
  }
}

module.exports = dropdownroles;
