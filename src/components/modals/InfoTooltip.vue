<template>
  <div class="info-tooltip-wrapper">
    <button
      class="info-button"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @focus="showTooltip = true"
      @blur="showTooltip = false"
      type="button"
      :aria-label="ariaLabel || $t('common.infoAria')"
    >
      <svg :width="iconSize" :height="iconSize" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
        <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <Transition name="tooltip-fade">
      <div
        v-if="showTooltip"
        class="tooltip"
        :class="[`tooltip-${position}`, { 'tooltip-multiline': isMultiline }]"
        role="tooltip"
      >
        <div class="tooltip-content">
          <template v-for="(line, index) in lines" :key="index">
            {{ line }}
            <br v-if="index < lines.length - 1" />
          </template>
        </div>
        <div class="tooltip-arrow"></div>
      </div>
    </Transition>
  </div>
</template>

<script>
  export default {
    name: 'InfoTooltip',
    props: {
      text: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        default: 'top',
        validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value),
      },
      width: {
        type: Number,
        default: 200,
      },
      charsPerLine: {
        type: Number,
        default: null,
      },
      iconSize: {
        type: Number,
        default: 16,
      },
      ariaLabel: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        showTooltip: false,
      }
    },
    computed: {
      lines() {
        const baseLines = this.text
          .split(/\n+/)
          .map((line) => line.trim())
          .filter((line) => line)

        if (!this.charsPerLine) {
          return baseLines
        }

        return baseLines.flatMap((line) => {
          if (line.length <= this.charsPerLine) return [line]

          const words = line.split(' ')
          const wrappedLines = []
          let currentLine = ''

          words.forEach((word) => {
            if ((currentLine + ' ' + word).trim().length <= this.charsPerLine) {
              currentLine += (currentLine ? ' ' : '') + word
            } else {
              if (currentLine) wrappedLines.push(currentLine)
              currentLine = word
            }
          })

          if (currentLine) wrappedLines.push(currentLine)
          return wrappedLines
        })
      },

      isMultiline() {
        return this.lines.length > 1
      },
    },
  }
</script>

<style scoped>
  .info-tooltip-wrapper {
    display: inline-block;
    position: relative;
  }

  .info-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    transition: color 0.2s ease;
    vertical-align: middle;
    line-height: 1;
  }

  .info-button:hover,
  .info-button:focus {
    color: #fff;
    outline: none;
  }

  .info-button svg {
    display: block;
  }

  .tooltip {
    position: absolute;
    z-index: 1000;
    padding: 8px 12px;
    background: #333;
    color: #fff;
    border-radius: 6px;
    font-size: 13px;
    line-height: 1.5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    pointer-events: none;
    width: v-bind('`${width}px`');
    white-space: normal;
  }

  .tooltip-content {
    position: relative;
    z-index: 1;
  }

  .tooltip-multiline {
    text-align: left;
  }

  .tooltip-top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip-bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip-left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  .tooltip-right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  .tooltip-top .tooltip-arrow {
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0 5px;
    border-color: #333 transparent transparent transparent;
  }

  .tooltip-bottom .tooltip-arrow {
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #333 transparent;
  }

  .tooltip-left .tooltip-arrow {
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent #333;
  }

  .tooltip-right .tooltip-arrow {
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 5px 5px 0;
    border-color: transparent #333 transparent transparent;
  }

  .tooltip-fade-enter-active,
  .tooltip-fade-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .tooltip-fade-enter-from,
  .tooltip-fade-leave-to {
    opacity: 0;
  }

  .tooltip-top.tooltip-fade-enter-from,
  .tooltip-top.tooltip-fade-leave-to {
    transform: translateX(-50%) translateY(4px);
  }

  .tooltip-bottom.tooltip-fade-enter-from,
  .tooltip-bottom.tooltip-fade-leave-to {
    transform: translateX(-50%) translateY(-4px);
  }

  .tooltip-left.tooltip-fade-enter-from,
  .tooltip-left.tooltip-fade-leave-to {
    transform: translateY(-50%) translateX(4px);
  }

  .tooltip-right.tooltip-fade-enter-from,
  .tooltip-right.tooltip-fade-leave-to {
    transform: translateY(-50%) translateX(-4px);
  }
</style>
