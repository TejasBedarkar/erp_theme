frappe.provide('frappe.listview_settings');

frappe.listview_settings['task_work'] = {
    onload: function(listview) {
        // Page load par inner button inject karein
        listview.page.add_inner_button(__('Show QR'), function() {
            let apiUrl = `${window.location.origin}/api/method/custom_ui.api.task.get_list_of_task_order`;
            let qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(apiUrl)}`;

            let d = new frappe.ui.Dialog({
                title: 'Master Task API QR Code',
                fields: [
                    {
                        fieldname: 'qr_preview',
                        fieldtype: 'HTML',
                        options: `
                            <div style="text-align: center; padding: 10px;">
                                <img src="${qrApiUrl}" style="width: 200px; height: 200px; border-radius: 8px; border: 1px solid #d1d8dd;" />
                                <p style="margin-top: 12px; font-size: 12px; color: #555;">
                                    Scan this shit: 
                                </p>
                                <input type="text" value="${apiUrl}" class="form-control" readonly style="text-align: center; font-size: 11px; background: #f8f9fa;">
                            </div>
                        `
                    }
                ]
            });
            d.show();
        }).addClass('btn-qr-custom');
    },

    refresh: function(listview) {
        // Filter section ke paas move karne ki script
        setTimeout(() => {
            let $btn = listview.page.wrapper.find('.btn-qr-custom');
            let $filterSec = listview.page.wrapper.find('.filter-section');
            if ($btn.length && $filterSec.length) {
                $btn.insertBefore($filterSec);
            }
        }, 100);
    }
};