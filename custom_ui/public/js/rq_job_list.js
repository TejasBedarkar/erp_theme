// Search is not bridged here: `RQJob.get_matching_job_ids` only honours the
// `queue` and `status` filters, so `job_name` is never queried server side.

magnaerp.method_path.rebrand_listview("RQ Job", "job_name");
