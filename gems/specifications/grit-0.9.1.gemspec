Gem::Specification.new do |s|
  s.name = %q{grit}
  s.version = "0.9.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Tom Preston-Werner"]
  s.date = %q{2008-10-07}
  s.description = %q{Grit is a Ruby library for extracting information from a git repository in and object oriented manner.}
  s.email = %q{tom@rubyisawesome.com}
  s.extra_rdoc_files = ["History.txt", "Manifest.txt", "README.txt"]
  s.files = ["History.txt", "Manifest.txt", "README.txt", "Rakefile", "grit.gemspec", "lib/grit/actor.rb", "lib/grit/blob.rb", "lib/grit/commit.rb", "lib/grit/commit_stats.rb", "lib/grit/config.rb", "lib/grit/diff.rb", "lib/grit/errors.rb", "lib/grit/git-ruby/commit_db.rb", "lib/grit/git-ruby/file_index.rb", "lib/grit/git-ruby/git_object.rb", "lib/grit/git-ruby/internal/loose.rb", "lib/grit/git-ruby/internal/mmap.rb", "lib/grit/git-ruby/internal/pack.rb", "lib/grit/git-ruby/internal/raw_object.rb", "lib/grit/git-ruby/object.rb", "lib/grit/git-ruby/repository.rb", "lib/grit/git-ruby.rb", "lib/grit/git.rb", "lib/grit/head.rb", "lib/grit/index.rb", "lib/grit/lazy.rb", "lib/grit/ref.rb", "lib/grit/repo.rb", "lib/grit/status.rb", "lib/grit/tag.rb", "lib/grit/tree.rb", "lib/grit.rb", "test/fixtures/blame", "test/fixtures/cat_file_blob", "test/fixtures/cat_file_blob_size", "test/fixtures/diff_2", "test/fixtures/diff_2f", "test/fixtures/diff_f", "test/fixtures/diff_i", "test/fixtures/diff_mode_only", "test/fixtures/diff_new_mode", "test/fixtures/diff_p", "test/fixtures/for_each_ref", "test/fixtures/for_each_ref_remotes", "test/fixtures/for_each_ref_tags", "test/fixtures/ls_tree_a", "test/fixtures/ls_tree_b", "test/fixtures/ls_tree_commit", "test/fixtures/rev_list", "test/fixtures/rev_list_count", "test/fixtures/rev_list_single", "test/fixtures/rev_parse", "test/fixtures/show_empty_commit", "test/fixtures/simple_config", "test/helper.rb", "test/profile.rb", "test/suite.rb", "test/test_actor.rb", "test/test_blob.rb", "test/test_commit.rb", "test/test_config.rb", "test/test_diff.rb", "test/test_git.rb", "test/test_grit.rb", "test/test_head.rb", "test/test_reality.rb", "test/test_remote.rb", "test/test_repo.rb", "test/test_tag.rb", "test/test_tree.rb", "test/test_file_index.rb", "test/test_raw.rb", "test/test_rubygit_alt.rb", "test/test_real.rb", "test/test_rubygit_index.rb", "test/test_index_status.rb", "test/test_rubygit_iv2.rb", "test/test_commit_write.rb", "test/test_rubygit.rb", "test/test_commit_stats.rb", "test/test_blame_tree.rb"]
  s.has_rdoc = true
  s.homepage = %q{http://github.com/mojombo/grit}
  s.rdoc_options = ["--main", "README.txt"]
  s.require_paths = ["lib"]
  s.rubyforge_project = %q{grit}
  s.rubygems_version = %q{1.2.0}
  s.summary = %q{Object model interface to a git repo}
  s.test_files = ["test/test_commit.rb", "test/test_file_index.rb", "test/test_grit.rb", "test/test_config.rb", "test/test_git.rb", "test/test_raw.rb", "test/test_rubygit_alt.rb", "test/test_remote.rb", "test/test_blob.rb", "test/test_real.rb", "test/test_actor.rb", "test/test_repo.rb", "test/test_tree.rb", "test/test_rubygit_index.rb", "test/test_index_status.rb", "test/test_reality.rb", "test/test_rubygit_iv2.rb", "test/test_commit_write.rb", "test/test_rubygit.rb", "test/test_commit_stats.rb", "test/test_tag.rb", "test/test_head.rb", "test/test_blame_tree.rb", "test/test_diff.rb"]

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 2

    if current_version >= 3 then
      s.add_runtime_dependency(%q<mime-types>, [">= 0"])
      s.add_development_dependency(%q<hoe>, [">= 1.7.0"])
    else
      s.add_dependency(%q<mime-types>, [">= 0"])
      s.add_dependency(%q<hoe>, [">= 1.7.0"])
    end
  else
    s.add_dependency(%q<mime-types>, [">= 0"])
    s.add_dependency(%q<hoe>, [">= 1.7.0"])
  end
end
