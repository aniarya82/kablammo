"use strict";

function Interface(server_results_chooser) {
  var valid_sources = [
    'toxodb_5.3_rrna_hits.xml',
    'toxodb_8.1_rrna_hits.xml',
    'enriched-rd-geneless.toxodb_8.1.blast.xml',
    'enriched-rd-geneless.uniprot_sprot.blast.xml',
    'enriched-rd-genes.toxodb_8.1.blast.xml',
    'enriched-rd-genes.uniprot_sprot.blast.xml',
    'enriched-rd-windows.toxodb_8.1.blast.xml',
    'enriched-rd-windows.uniprot_sprot.blast.xml',
    'overlapping-but-outside.toxodb_8.1.blast.xml',
    'overlapping-but-outside.uniprot_sprot.blast.xml',
  ];
  this._form = $('#load-results-form');
  this._server_results_chooser = $('#server-results-chooser');
  this._populate_blast_results_chooser(valid_sources);
}

Interface.prototype.update_results_info = function(blast_results) {
  // Don't also update "max query seqs" form field's max value, as if user
  // chooses different BLAST result set, she may want to also input a max value
  // higher than the number of sequences in the current data set.
  $('#query-seqs-count').text(blast_results.iterations_count);
  $('#filtered-query-seqs-count').text(blast_results.filtered_iterations_count);
  $('#hits-count').text(blast_results.hits_count);
  $('#filtered-hits-count').text(blast_results.filtered_hits_count);
}

Interface.prototype._populate_blast_results_chooser = function(valid_sources) {
  var self = this;
  valid_sources.forEach(function(source) {
    self._server_results_chooser.append($('<option>', {
      value: source,
      text:  source
    }));
  });
}

Interface.prototype.create_header = function(table, label) {
  var tr = d3.select(table).append('tr');
  tr.append('th').text('Subject');
  tr.append('th').text('Hits for query ' + label);
}

Interface.prototype.configure_query_form = function(on_load_from_server, on_load_local_file) {
  var local_chooser = $('#local-file-chooser');

  $('#choose-file').click(function(evt) {
    evt.preventDefault();
    local_chooser.click();
  })
  local_chooser.change(function() {
    var label = $(this).parent().find('.file-label');
    var file = local_chooser.get(0).files[0];
    console.log(file);
    label.text(file.name);
  });

  this._form.submit(function(evt) {
    evt.preventDefault();
    var active_id = $(this).find('.tab-pane.active').attr('id');

    if(active_id === 'load-from-server') {
      var server_results_chooser = $('#server-results-chooser');
      var blast_results_filename = server_results_chooser.val();
      on_load_from_server(blast_results_filename);
    } else if (active_id === 'load-local-file') {
      var file = local_chooser.get(0).files[0];
      // User hasn't selected file.
      if(!file)
        return;
      on_load_local_file(file);
    } else {
      throw 'Invalid active tab ID: ' + active_id;
    }
  });
}

Interface.prototype.display_results = function() {
  this._form.submit();
}

Interface.error = function(msg) {
  var container = $('#errors');
  var error = container.find('.alert-error').first().clone();
  error.removeClass('example');
  error.find('.message').text(msg);
  container.append(error);
}
