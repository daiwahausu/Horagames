//=============================================================================
// TMVplugin - メッセージ制御文字拡張
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 1.31
// 最終更新日: 2016/03/15
//=============================================================================

/*:
 * @plugindesc 文章の表示に使える制御文字を追加します。
 * 
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @help
 * イベントコマンド『文章の表示』と『選択肢の表示』、
 * データベースの『説明』などで使用できます。
 *
 * \J[n]      # n 番の職業名に置き換えます。
 * \AJ[n]     # n 番のアクターの現在の職業名に置き換えます。
 * \PJ[n]     # n 番目のパーティメンバーの現在の職業名に置き換えます。
 * \ANN[n]    # n 番のアクターの現在の二つ名に置き換えます。
 * \PNN[n]    # n 番目のパーティメンバーの現在の二つ名に置き換えます。
 * \IN[n]     # n 番のアイテム名（アイコン付き）に置き換えます。
 * \WN[n]     # n 番の武器名（アイコン付き）に置き換えます。
 * \AN[n]     # n 番の防具名（アイコン付き）に置き換えます。
 * \SN[n]     # n 番のスキル名（アイコン付き）に置き換えます。
 * \ML[n]     # n 番のアクターのレベル上限に置き換えます。
 * \INUM[n]   # n 番のアイテムの所持数に置き換えます。
 *              ただし、0 番を指定した場合は所持金に置き換えます。
 * \WNUM[n]   # n 番の武器の所持数に置き換えます。
 * \ANUM[n]   # n 番の防具の所持数に置き換えます。
 * \MAP[n]    # n 番のマップ名（表示名ではない）に置き換えます。
 *
 * おまけ機能として、動的な説明が設定されたアイテム（スキル）の
 * 説明文が戦闘中に更新されない場合があるという不都合も修正します。
 *
 */

var Imported = Imported || {};
Imported.TMTextEscape = true;

(function() {

  var _Window_Base_convertEscapeCharacters = 
      Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = _Window_Base_convertEscapeCharacters.call(this, text);
    text = text.replace(/\x1bJ\[(\d+)\]/gi, function() {
      return this._className(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bAJ\[(\d+)\]/gi, function() {
      return this.actorClassName(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bPJ\[(\d+)\]/gi, function() {
        return this.partyMemberClassName(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bANN\[(\d+)\]/gi, function() {
      return this.actorNickname(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bPNN\[(\d+)\]/gi, function() {
        return this.partyMemberNickname(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bIN\[(\d+)\]/gi, function() {
      return this.itemName(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bWN\[(\d+)\]/gi, function() {
      return this.weaponName(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bAN\[(\d+)\]/gi, function() {
      return this.armorName(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bSN\[(\d+)\]/gi, function() {
      return this.skillName(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bML\[(\d+)\]/gi, function() {
      return this.maxLevel(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bINUM\[(\d+)\]/gi, function() {
      return this.itemNumber(+arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bWNUM\[(\d+)\]/gi, function() {
      return this.weaponNumber(arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bANUM\[(\d+)\]/gi, function() {
      return this.armorNumber(arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bMAP\[(\d+)\]/gi, function() {
      return this.mapName(+arguments[1]);
    }.bind(this));
    return text;
  };

  Window_Base.prototype._className = function(n) {
    var _class = n >= 1 ? $dataClasses[n] : null;
    return _class ? _class.name : '';
  };

  Window_Base.prototype.actorClassName = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.currentClass().name : '';
  };

  Window_Base.prototype.partyMemberClassName = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.currentClass().name : '';
  };

  Window_Base.prototype.actorNickname = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.nickname() : '';
  };

  Window_Base.prototype.partyMemberNickname = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.nickname() : '';
  };

  Window_Base.prototype.itemName = function(n) {
    var item = n >= 1 ? $dataItems[n] : null;
    return item ? '\x1bI[' + item.iconIndex + ']' + item.name : '';
  };

  Window_Base.prototype.weaponName = function(n) {
    var item = n >= 1 ? $dataWeapons[n] : null;
    return item ? '\x1bI[' + item.iconIndex + ']' + item.name : '';
  };

  Window_Base.prototype.armorName = function(n) {
    var item = n >= 1 ? $dataArmors[n] : null;
    return item ? '\x1bI[' + item.iconIndex + ']' + item.name : '';
  };

  Window_Base.prototype.skillName = function(n) {
    var item = n >= 1 ? $dataSkills[n] : null;
    return item ? '\x1bI[' + item.iconIndex + ']' + item.name : '';
  };

  Window_Base.prototype.maxLevel = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.maxLevel() : '';
  };

  Window_Base.prototype.itemNumber = function(n) {
    if (n === 0) return $gameParty.gold();
    var item = n >= 1 ? $dataItems[n] : null;
    return item ? $gameParty.numItems(item) : '';
  };

  Window_Base.prototype.weaponNumber = function(n) {
    var item = n >= 1 ? $dataWeapons[n] : null;
    return item ? $gameParty.numItems(item) : '';
  };

  Window_Base.prototype.armorNumber = function(n) {
    var item = n >= 1 ? $dataArmors[n] : null;
    return item ? $gameParty.numItems(item) : '';
  };

  Window_Base.prototype.mapName = function(n) {
    var mapInfo = n === 0 ? $dataMapInfos[$gameMap.mapId()] : $dataMapInfos[n];
    return mapInfo ? mapInfo.name : '';
  };

  //-----------------------------------------------------------------------------
  // Scene_Battle
  //

  var _Scene_Battle_commandSkill = Scene_Battle.prototype.commandSkill;
  Scene_Battle.prototype.commandSkill = function() {
    _Scene_Battle_commandSkill.call(this);
    this._helpWindow.refresh();
  };

})();