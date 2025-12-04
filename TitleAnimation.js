/*:
 * @target MZ
 * @plugindesc Title Screen Background Animation
 * @author Gemini Assistant
 * 
 * * @param Image Base Name
 * @type string
 * @default Title_Ani_
 * @desc The base name for animation images (e.g., Title_Ani_). 
 * Images should be named Title_Ani_01, Title_Ani_02, etc.
 * 
 * * @param Frame Count
 * @type number
 * @default 3
 * @desc The number of frames in the animation (e.g., 3 for 01, 02, 03).
 * 
 * * @param Frame Duration
 * @type number
 * @default 60
 * @desc Duration each frame is displayed, in game frames (60 frames = 1 second).
 * 
 * * @help
 * This plugin replaces the standard title background with a sequence 
 * of images to create an animation.
 * * 1. Place your animation images (e.g., Title_Ani_01.png, Title_Ani_02.png) 
 * in the img/titles1 folder.
 * 2. Set the parameters above to match your image files.
 * 3. The animation will run on the title screen.
 */

(() => {
    // 1. 플러그인 파라미터 가져오기
    const pluginName = "TitleAnimation";
    const parameters = PluginManager.parameters(pluginName);
    const baseName = String(parameters['Image Base Name'] || 'Title_Ani_');
    const frameCount = Number(parameters['Frame Count'] || 3);
    const frameDuration = Number(parameters['Frame Duration'] || 60);

    // 2. Scene_Title 클래스 수정
    const _Scene_Title_createBackground = Scene_Title.prototype.createBackground;

    Scene_Title.prototype.createBackground = function () {
        // 기존 배경 생성 함수 호출 (titles1 이미지를 로드)
        _Scene_Title_createBackground.call(this);

        // 기존 배경 스프라이트를 제거하거나 숨김 (만약 우리가 애니메이션을 대체할 거라면)
        // 이 예시에서는 titles1의 Title1.png 위에 덮어씌웁니다.
        // this._backSprite1.visible = false;
        // this._backSprite2.visible = false; 

        // 애니메이션 스프라이트 생성
        this._animationSprites = [];
        this._currentFrameIndex = 0;
        this._timer = 0;

        // 모든 애니메이션 이미지를 로드하고 숨김
        for (let i = 1; i <= frameCount; i++) {
            const fileName = baseName + String(i).padStart(2, '0');
            const sprite = new Sprite(ImageManager.loadTitle1(fileName));
            sprite.opacity = 0; // 시작 시 투명하게
            this._animationSprites.push(sprite);
            this.addChild(sprite);
        }

        // 첫 번째 프레임을 표시
        if (this._animationSprites.length > 0) {
            this._animationSprites[0].opacity = 255;
            this._animationSprites[0].visible = true;
        }
    };

    // 3. update 함수 수정 (매 프레임마다 실행)
    const _Scene_Title_update = Scene_Title.prototype.update;

    Scene_Title.prototype.update = function () {
        _Scene_Title_update.call(this);
        this.updateTitleAnimation();
    };

    Scene_Title.prototype.updateTitleAnimation = function () {
        // 타이머 증가
        this._timer++;

        // 프레임 지속 시간이 되면 다음 프레임으로 전환
        if (this._timer >= frameDuration) {
            this._timer = 0;

            const previousIndex = this._currentFrameIndex;

            // 다음 인덱스 계산 (순환)
            this._currentFrameIndex = (this._currentFrameIndex + 1) % frameCount;

            // 이전 프레임 숨기기
            if (this._animationSprites[previousIndex]) {
                this._animationSprites[previousIndex].opacity = 0;
            }

            // 새 프레임 표시
            if (this._animationSprites[this._currentFrameIndex]) {
                this._animationSprites[this._currentFrameIndex].opacity = 255;
            }
        }
    };
})();