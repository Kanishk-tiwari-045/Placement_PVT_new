import os
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

ATTACHMENT_TYPE = (
    ("resume", "Resume"),
    ("misc", "Miscellaneous"),
    ("academic", "Academic Docs"),
    ("photo_id", "Photo ID"),
    ("certificates", "Certificates"),
)

def attachment_upload(instance, filename):
    """Stores the attachment in a 'per module/appname/primary key' folder"""
    return "attachments/{app}_{model}/{pk}/{filename}".format(
        app=instance.content_object._meta.app_label,
        model=instance.content_object._meta.object_name.lower(),
        pk=instance.content_object.pk,
        filename=filename,
    )

class AttachmentManager(models.Manager):
    def attachments_for_object(self, obj):
        object_type = ContentType.objects.get_for_model(obj)
        return self.filter(content_type__pk=object_type.id, object_id=obj.pk)

class Attachment(models.Model):
    objects = AttachmentManager()

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    attachment_file = models.FileField(_("attachment"), upload_to=attachment_upload)
    attachment_type = models.CharField(
        choices=ATTACHMENT_TYPE, blank=True, null=True, max_length=500
    )
    created = models.DateTimeField(_("created"), auto_now_add=True)
    modified = models.DateTimeField(_("modified"), auto_now=True)

    class Meta:
        verbose_name = _("attachment")
        verbose_name_plural = _("attachments")
        ordering = ["-created"]
        permissions = (
            ("delete_foreign_attachments", _("Can delete foreign attachments")),
        )

    def __str__(self):
        return _("attached {filename}").format(
            filename=self.attachment_file.name,
        )

    @property
    def filename(self):
        return os.path.split(self.attachment_file.name)[1]
