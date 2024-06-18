/** @odoo-module */

import { PosStore } from "@point_of_sale/app/store/pos_store";
import { Order } from "@point_of_sale/app/store/models";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype, {
    // @Override
    async processServerData(loadedData) {
        await super.processServerData(...arguments);
        this.self_ordering = this.data.custom.self_ordering;
    },
});

patch(Order.prototype, {
    setup() {
        super.setup(...arguments);
        if (this.name.startsWith("Self-Order")) {
            this.trackingNumber = "S" + this.trackingNumber;
        }
    },

    defaultTableNeeded(options) {
        return (
            super.defaultTableNeeded(...arguments) &&
            !this.name.includes("Kiosk") &&
            !this.name.includes("Self-Order")
        );
    },

    updateSequenceNumber(json) {
        if (!json.name.startsWith("Self-Order")) {
            super.updateSequenceNumber(json);
        }
    },
});
