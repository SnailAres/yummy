Component({
  properties: {
    snack: {
      type: Object,
      value: {},
    },
  },
  methods: {
    onTap() {
      this.triggerEvent("cardtap", { snackId: this.properties.snack.id });
    },
  },
});
