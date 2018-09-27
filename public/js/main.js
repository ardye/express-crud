$(document).ready(() => {
  $('.deleteUser').on('click', deleteUser);
});

function deleteUser() {
  const confirmation = confirm('Do you want to delete data?');
  if (confirmation) {
    $.ajax({
      type: 'DELETE',
      url: '/users/delete/' + $(this).data('id'),
      success: function(data) {
        window.location.replace('/');
      }
    });
  } else {
    return false;
  }
}
